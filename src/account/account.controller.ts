import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common'
import { AccountService } from './account.service'
import { UpdateUserDto } from './account.dto'
import { User } from '@prisma/client'
import { JwtGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/user/decorator'

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@UseGuards(JwtGuard)
	@Get('profile')
	getProfile(@GetUser() user: User) {
		return this.accountService.getProfile(user)
	}

	@UseGuards(JwtGuard)
	@Patch('edit')
	updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.accountService.updateProfile(user.id, updateUserDto)
	}
}
