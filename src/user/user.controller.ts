import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto'
import { User } from '@prisma/client'
import { GetUser } from 'lib/decorators/user.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('all')
	findAllUsers() {
		return this.userService.findAllUsers()
	}

	@Get('')
	findSelf(@GetUser() user: User) {
		return this.userService.findUserById(user.id)
	}

	@Get('u/:userId')
	findUserById(@Param('userId') userId: string) {
		return this.userService.findUserById(+userId)
	}

	@Patch('edit')
	updateSelf(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(user.id, updateUserDto)
	}

	@Patch('edit/:userId')
	updateUser(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(userId, updateUserDto)
	}
}
