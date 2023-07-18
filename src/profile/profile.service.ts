import { Injectable } from '@nestjs/common'
import { UpdateProfileDto } from './profile.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Profile, Role } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'

@Injectable()
@Roles(Role.USER, Role.SELLER)
export class ProfileService {
	constructor(private prisma: PrismaService) {}

	async getProfile(userId: number): Promise<Profile> {
		const profile = this.prisma.profile.findUnique({ where: { userId } })
		return profile
	}

	async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
		const updatedProfile = await this.prisma.profile.update({ where: { userId }, data: updateProfileDto })

		return updatedProfile
	}
}
