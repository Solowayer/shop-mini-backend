import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Profile, User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UpdateProfileDto, UpdateUserDto } from './user.dto'
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

	async getUserProfile(userId: number): Promise<Profile> {
		
		const profile = this.prisma.profile.findUnique({ where: { userId } })
		return profile
	}

	async updateUserProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
		const updatedProfile = await this.prisma.profile.update({ where: { userId }, data: updateProfileDto })

		return updatedProfile
	}

	async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: updateUserDto
		})

		return user
	}
}
