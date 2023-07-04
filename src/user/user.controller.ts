import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto } from './user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('')
	getAllUsers() {
		return this.userService.getAllUsers()
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser({ id: +id }, updateUserDto)
	}
}
