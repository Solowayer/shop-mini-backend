import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UpdateUserDto } from './dto'
import { UserFullType } from 'lib/types/full-model.types'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async findAllUsers() {
		const users = await this.prisma.user.findMany()
		return users
	}

	async findOneUser(where: Prisma.UserWhereUniqueInput, userSelect: Prisma.UserSelect = {}): Promise<UserFullType> {
		const defaultUserSelect: Prisma.UserSelectScalar = {
			id: true,
			createdAt: true,
			updatedAt: true,
			email: true,
			phoneNumber: true,
			passwordHash: true,
			role: true
		}

		const user = await this.prisma.user.findUnique({ where, select: { ...defaultUserSelect, ...userSelect } })
		return user
	}

	async findUserById(userId: number): Promise<UserFullType> {
		const user = await this.findOneUser({ id: userId })
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: updateUserDto
		})

		return user
	}
}
