import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { SignupUserDto, SigninUserDto } from './user-auth.dto'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'

@Injectable()
export class UserAuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signupUser(signupUserDto: SignupUserDto) {
		const { username, email, password, phoneNumber } = signupUserDto

		const existingUser = await this.prisma.user.findUnique({ where: { email } })
		if (existingUser) throw new BadRequestException('Користувач з таким email вже існує')

		const passwordHash = await argon.hash(password)

		const newUser = await this.prisma.user.create({
			data: { username, email, passwordHash, phoneNumber, role: 'USER' }
		})

		const token = await this.signToken(newUser.id, newUser.email)

		return { newUser, token }
	}

	async signinUser(signinUserDto: SigninUserDto) {
		const { emailOrPhoneNumber, password } = signinUserDto

		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] }
		})

		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		const token = await this.signToken(user.id, user.email)

		return { user, token }
	}

	private async signToken(userId: number, email: string): Promise<string> {
		const payload = {
			sub: userId,
			email
		}

		const secret = this.config.get('JWT_ACCESS_USER_TOKEN_SECRET')

		return await this.jwt.signAsync(payload, { secret, expiresIn: '1h' })
	}
}
