import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SigninUserDto, SignupUserDto } from './user-auth.dto'
import { Request } from 'express'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	signup(@Body() signupUserDto: SignupUserDto, @Req() req: Request) {
		return this.userAuthService.signupUser(signupUserDto, req)
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	signin(@Body() signinUserDto: SigninUserDto, @Req() req: Request) {
		return this.userAuthService.signinUser(signinUserDto, req)
	}
}
