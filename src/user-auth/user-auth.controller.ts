import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SigninUserDto, SignupUserDto } from './user-auth.dto'
import { Request, Response } from 'express'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	signup(@Body() signupUserDto: SignupUserDto, @Res() res: Response) {
		return this.userAuthService.signupUser(signupUserDto, res)
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	signin(@Body() signinUserDto: SigninUserDto, @Res() res: Response) {
		return this.userAuthService.signinUser(signinUserDto, res)
	}
}
