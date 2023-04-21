import { Controller, Post, Body } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SigninUserDto, SignupUserDto } from './user-auth.dto'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@Post('signup')
	signup(@Body() signupDto: SignupUserDto) {
		return this.userAuthService.signupUser(signupDto)
	}

	@Post('signin')
	login(@Body() signinDto: SigninUserDto) {
		return this.userAuthService.signinUser(signinDto)
	}
}
