import { Controller, Post, Body, Res } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SigninUserDto, SignupUserDto } from './user-auth.dto'
import { Response } from 'express'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@Post('signup')
	signup(@Body() signupUserDto: SignupUserDto, @Res() res: Response) {
		return this.userAuthService.signupUser(signupUserDto, res)
	}

	@Post('signin')
	login(@Body() signinUserDto: SigninUserDto, @Res() res: Response) {
		return this.userAuthService.signinUser(signinUserDto, res)
	}
}
