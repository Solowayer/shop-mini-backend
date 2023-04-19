import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	signup(@Body() signupDto: SignupDto) {
		return this.authService.signup(signupDto)
	}

	@Post('signin')
	login(@Body() signinDto: SigninDto) {
		return this.authService.signin(signinDto)
	}
}
