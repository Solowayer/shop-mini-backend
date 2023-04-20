import { Controller, Post, Body } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SigninDto, SignupDto } from './user-auth.dto'

@Controller('auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@Post('signup')
	signup(@Body() signupDto: SignupDto) {
		return this.userAuthService.signup(signupDto)
	}

	@Post('signin')
	login(@Body() signinDto: SigninDto) {
		return this.userAuthService.signin(signinDto)
	}
}
