/* eslint-disable no-console */
import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto, RegisterUserDto } from './dto'
import { Request, Response } from 'express'
import { LocalGuard } from 'lib/guards/local.guard'
import { Public } from 'lib/decorators/public.decorator'
import { AuthenticatedGuard } from 'lib/guards/authenticated.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly userAuthService: AuthService) {}

	@Public()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	register(@Body() signupUserDto: RegisterUserDto) {
		return this.userAuthService.registerUser(signupUserDto)
	}

	@UseGuards(LocalGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	login(@Body() loginUserDto: LoginUserDto) {
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

	@Get('check-auth')
	checkAuth(@Req() req: Request) {
		return req.isAuthenticated()
	}
}
