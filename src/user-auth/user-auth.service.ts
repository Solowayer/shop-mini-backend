import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { SignupUserDto, SigninUserDto } from './user-auth.dto'
import * as argon from 'argon2'
import { Request } from 'express'

@Injectable()
export class UserAuthService {
	constructor(private prisma: PrismaService) {}

	async registerUser(signupUserDto: SignupUserDto, req: Request) {
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

		delete user.passwordHash

		return user
	}
}
