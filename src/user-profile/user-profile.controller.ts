import { Body, Controller, Get, Patch } from '@nestjs/common'
import { UserProfileService } from './user-profile.service'
import { UpdateProfileDto } from './dto'
import { User } from '@prisma/client'
import { GetUser } from 'lib/decorators/user.decorator'

@Controller('profile')
export class UserProfileController {
	constructor(private readonly userProfileService: UserProfileService) {}

	@Get('')
	get(@GetUser() user: User) {
		return this.userProfileService.getProfile(user.id)
	}

	@Patch('edit')
	update(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
		return this.userProfileService.updateProfile(user.id, updateProfileDto)
	}
}
