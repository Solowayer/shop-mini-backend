import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtGuard } from 'src/auth/guard'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll() {
		return this.userService.findAll()
	}

	@UseGuards(JwtGuard)
	@Get('info')
	getUserInfo() {
		return 'my info'
	}
}
