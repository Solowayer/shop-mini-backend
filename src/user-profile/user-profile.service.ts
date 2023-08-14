import { Injectable } from '@nestjs/common'
import { UpdateProfileDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { UserProfile, Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Injectable()
@Roles(Role.USER, Role.SELLER)
export class UserProfileService {
	constructor(private prisma: PrismaService) {}

	async getProfile(userId: number): Promise<UserProfile> {
		const profile = this.prisma.userProfile.findUnique({ where: { userId } })
		return profile
	}

	async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<UserProfile> {
		const updatedProfile = await this.prisma.userProfile.update({ where: { userId }, data: updateProfileDto })

		return updatedProfile
	}
}
