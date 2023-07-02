import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UpdateUserDto } from './user.dto'
import { UserFullType } from './user.types'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getOneUser(
		where: Prisma.UserWhereUniqueInput,
		userSelect: Prisma.UserSelect = {}
	): Promise<Partial<UserFullType>> {
		const user = await this.prisma.user.findUnique({ where, select: { ...userSelect } })
		return user
	}

	async getAllUsers() {
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
