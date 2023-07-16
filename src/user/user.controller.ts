import { Body, Controller, Get, NotFoundException, Param, Patch } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateProfileDto, UpdateUserDto } from './user.dto'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/decorators/user.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('all')
	getAll() {
		return this.userService.getAllUsers()
	}

	@Get('')
	getSelf(@GetUser() user: User) {
		return this.userService.getUserById(user.id)
	}

	@Get('u/:userId')
	get(@Param('userId') userId: string) {
		return this.userService.getUserById(+userId)
	}

	@Get('profile')
	getProfile(@GetUser() user: User | undefined) {
		return this.userService.getUserProfile(user.id)
	}

	@Patch('profile/edit')
	updateProfile(@GetUser() user: User, updateProfileDto: UpdateProfileDto) {
		return this.userService.updateUserProfile(user.id, updateProfileDto)
	}

	@Patch('edit')
	updateSelf(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(user.id, updateUserDto)
	}

	@Patch('edit/:userId')
	update(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(userId, updateUserDto)
	}
}
