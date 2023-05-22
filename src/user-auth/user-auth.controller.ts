/* eslint-disable no-console */
import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, Session, Get, UseGuards } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { LoginUserDto, RegisterUserDto } from './user-auth.dto'
import { Request, Response } from 'express'
import { LocalGuard, AuthenticatedGuard } from 'src/common/guards/local.guard'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	registerUser(@Body() signupUserDto: RegisterUserDto) {
		return this.userAuthService.registerUser(signupUserDto)
	}

	@UseGuards(LocalGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.userAuthService.loginUser(loginUserDto)
	}

	@UseGuards(AuthenticatedGuard)
	@Post('logout')
	logout(@Req() req: Request, @Res() res: Response) {
		return this.userAuthService.logout(req, res)
	}

	@UseGuards(AuthenticatedGuard)
	@Post('destroy')
	destroy(@Req() req: Request, @Res() res: Response) {
		return this.userAuthService.destroy(req, res)
	}

	@Get('test')
	getAuthSession(@Session() session: Record<string, any>) {
		console.log(session)
		console.log(session)
		return session
	}
}
