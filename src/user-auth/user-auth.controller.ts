import { Controller, Post, Body, Res, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { SigninUserDto, SignupUserDto } from './user-auth.dto'
import { Response } from 'express'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'
import { RtGuard } from 'src/common/guards/rt.guard'
import { JwtUserGuard } from 'src/common/guards/jwt.guard'
import { RtPayload } from 'src/common/strategies/rt.strategy'

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

	@UseGuards(JwtUserGuard)
	@Post('signout')
	@HttpCode(HttpStatus.OK)
	signout(@GetUser() user: User, @Res() res: Response) {
		return this.userAuthService.signoutUser(user.id, res)
	}

	@UseGuards(RtGuard)
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	refreshTokens(@GetUser() rtData: RtPayload, @Res() res: Response) {
		return this.userAuthService.refreshTokens(rtData.sub, rtData.refreshToken, res)
	}
}
