import { Controller, Get, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtGuard } from 'src/auth/guard'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@UseGuards(JwtGuard)
	@Get('info')
	getUserInfo() {
		return 'my info'
	}
}
