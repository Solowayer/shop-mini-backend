import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UpdateUserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers() {
		// const users = await this.prisma.user.findMany({ select: { passwordHash: false, id: true } })
		const users = await this.prisma.user.findMany()
		return users
	}

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
