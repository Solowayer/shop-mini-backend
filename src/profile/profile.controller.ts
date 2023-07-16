import { Controller, Get, Patch } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { UpdateProfileDto } from './profile.dto'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/decorators/user.decorator'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get('')
	get(@GetUser() user: User) {
		return this.profileService.getProfile(user.id)
	}

	@Patch('edit')
	update(@GetUser() user: User, updateProfileDto: UpdateProfileDto) {
		return this.profileService.updateProfile(user.id, updateProfileDto)
	}
}
