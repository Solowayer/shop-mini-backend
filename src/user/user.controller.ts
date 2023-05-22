import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthenticatedGuard } from 'src/common/guards/local.guard'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(AuthenticatedGuard)
	@Get('')
	getAllUsers() {
		return this.userService.getAllUsers()
	}
}
