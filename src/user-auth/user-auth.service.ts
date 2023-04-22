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

		const newUser = await this.prisma.user.create({ data: { username, email, passwordHash, phoneNumber } })

		const token = this.signToken(newUser.id, newUser.email)

		return token
	}

	async signinUser(signinUserDto: SigninUserDto) {
		const { email, password, phoneNumber } = signinUserDto

		const user = await this.prisma.user.findFirst({ where: { OR: [{ email }, { phoneNumber }] } })
		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		const token = this.signToken(user.id, user.email)

		return token
	}

	private async signToken(userId: number, email: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email
		}

		const secret = this.config.get('JWT_ACCESS_USER_TOKEN_SECRET')

		const accessToken = await this.jwt.signAsync(payload, { secret, expiresIn: '1h' })

		return { access_token: accessToken }
	}
}
