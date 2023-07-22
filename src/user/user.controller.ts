import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto'
import { User } from '@prisma/client'
import { GetUser } from 'lib/decorators/user.decorator'

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

	@Patch('edit')
	updateSelf(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(user.id, updateUserDto)
	}

	@Patch('edit/:userId')
	update(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(userId, updateUserDto)
	}
}
