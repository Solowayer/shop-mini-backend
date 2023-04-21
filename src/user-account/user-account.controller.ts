import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common'
import { UserAccountService } from './user-account.service'
import { UpdateUserDto } from './user-account.dto'
import { User } from '@prisma/client'
import { JwtGuard } from 'src/user-auth/user-auth.guard'
import { GetUser } from 'src/user/user.decorator'

@Controller('account')
export class UserAccountController {
	constructor(private readonly userAccountService: UserAccountService) {}

	@UseGuards(JwtGuard)
	@Get('profile')
	getProfile(@GetUser() user: User) {
		return this.userAccountService.getProfile(user)
	}

	@UseGuards(JwtGuard)
	@Patch('edit')
	updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.userAccountService.updateProfile(user.id, updateUserDto)
	}
}