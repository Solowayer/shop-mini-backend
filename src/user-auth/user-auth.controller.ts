import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, Session, Get, UseGuards } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SignupUserDto } from './user-auth.dto'
import { Request } from 'express'
import { LocalGuard, AuthenticatedGuard } from 'src/common/guards/local.guard'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@UseGuards(LocalGuard)
	@Post('login')
	async login(@GetUser() user: User) {
		return user
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	registerUser(@Body() signupUserDto: SignupUserDto, @Req() req: Request) {
		return this.userAuthService.registerUser(signupUserDto, req)
	}

	@Get('')
	getAuthSession(@Session() session: Record<string, any>) {
		console.log(session)
		console.log(session.id)
		session.authenticated = true
		return session
	}

	@UseGuards(AuthenticatedGuard)
	@Get('status')
	async getAuthStatus(@Req() req: Request) {
		return req.user
	}
}
