import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common'
import { UserAccountService } from './user-account.service'
import { UpdateUserDto } from './user-account.dto'
import { User } from '@prisma/client'
import { JwtUserGuard } from 'src/common/guards'
import { GetUser } from 'src/common/decorators'

@Controller('account')
export class UserAccountController {
	constructor(private readonly userAccountService: UserAccountService) {}

	@UseGuards(JwtUserGuard)
	@Get('profile')
	getProfile(@GetUser() user: User) {
		return this.userAccountService.getProfile(user)
	}

	@UseGuards(JwtUserGuard)
	@Patch('edit')
	updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.userAccountService.updateProfile(user.id, updateUserDto)
	}
}
