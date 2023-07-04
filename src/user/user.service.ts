import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UpdateUserDto } from './user.dto'
import { UserFullType } from 'src/common/types/full-model.types'
import { userObject } from 'src/common/return-objects'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers() {
		const users = await this.prisma.user.findMany()
		return users
	}

	async getOneUser(where: Prisma.UserWhereUniqueInput, userSelect: Prisma.UserSelect = {}): Promise<UserFullType> {
		const user = await this.prisma.user.findUnique({ where, select: { ...userObject, ...userSelect } })
		return user
	}

	async getUserById(userId: number): Promise<UserFullType> {
		const user = await this.getOneUser({ id: userId })
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async updateUser(where: Prisma.UserWhereUniqueInput, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.prisma.user.update({
			where,
			data: updateUserDto
		})

		return user
	}
}
