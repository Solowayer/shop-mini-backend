import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { SignupUserDto, SigninUserDto } from './user-auth.dto'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import { Response } from 'express'

@Injectable()
export class UserAuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signupUser(signupUserDto: SignupUserDto, res: Response) {
		const { username, email, password, phoneNumber } = signupUserDto

		const existingUser = await this.prisma.user.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})
		if (existingUser) throw new BadRequestException('Користувач з таким email або phoneNumber вже існує')

		const passwordHash = await argon.hash(password)

		const user = await this.prisma.user.create({
			data: { username, email, passwordHash, phoneNumber, role: 'USER' }
		})

		const token = await this.signToken(user.id, user.email)

		if (!token) {
			throw new ForbiddenException('No token here')
		}

		res.cookie('token', token)
		res.send({ user, token })
	}

	async signinUser(signinUserDto: SigninUserDto, res: Response) {
		const { emailOrPhoneNumber, password } = signinUserDto

		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] }
		})

		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		const token = await this.signToken(user.id, user.email)

		res.cookie('token', token)
		res.send({ user, token })
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
