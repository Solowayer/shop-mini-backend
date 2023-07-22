import { Body, Controller, Get, Patch } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { UpdateProfileDto } from './dto'
import { User } from '@prisma/client'
import { GetUser } from 'lib/decorators/user.decorator'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get('')
	get(@GetUser() user: User) {
		return this.profileService.getProfile(user.id)
	}

	@Patch('edit')
	update(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
		return this.profileService.updateProfile(user.id, updateProfileDto)
	}
}
