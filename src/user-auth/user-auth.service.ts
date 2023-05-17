import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { SignupUserDto, SigninUserDto } from './user-auth.dto'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import { Response } from 'express'

@Injectable()
export class UserAuthService {
	constructor(private prisma: PrismaService, private config: ConfigService) {}

	async signupUser(signupUserDto: SignupUserDto, res: Response) {
		const { username, email, password, phoneNumber } = signupUserDto

		const existingUser = await this.prisma.user.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})

		if (existingUser && phoneNumber !== null)
			throw new BadRequestException('Користувач з таким email або phoneNumber вже існує')

		const passwordHash = await argon.hash(password)

		const user = await this.prisma.user.create({
			data: { username, email, passwordHash, phoneNumber, role: 'USER' }
		})
	}

	async signinUser(signinUserDto: SigninUserDto, res: Response) {
		const { emailOrPhoneNumber, password } = signinUserDto

		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] }
		})

		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')
	}
}
