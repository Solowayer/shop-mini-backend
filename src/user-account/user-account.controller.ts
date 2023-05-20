import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common'
import { UserAccountService } from './user-account.service'
import { UpdateUserDto } from './user-account.dto'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/decorators/user.decorator'
import { AuthenticatedGuard } from 'src/common/guards/local.guard'

@Controller('account')
export class UserAccountController {
	constructor(private readonly userAccountService: UserAccountService) {}

	@UseGuards(AuthenticatedGuard)
	@Get('profile')
	getProfile(@GetUser() user: User) {
		return this.userAccountService.getProfile(user)
	}

	@UseGuards(AuthenticatedGuard)
	@Patch('edit')
	updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.userAccountService.updateProfile(user.id, updateUserDto)
	}
}
