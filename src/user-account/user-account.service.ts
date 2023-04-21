import { Injectable } from '@nestjs/common'
import { UpdateUserDto } from './user-account.dto'
import { PrismaService } from 'prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class UserAccountService {
	constructor(private prisma: PrismaService) {}

	getProfile(user: User) {
		return user
	}

	async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: updateUserDto
		})

		delete user.passwordHash

		return user
	}
}
