import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Role } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { JwtUserGuard } from 'src/common/guards/jwt.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtUserGuard, RolesGuard)
	@Roles(Role.USER)
	@Get('')
	getAllUsers() {
		return this.userService.getAllUsers()
	}
}
