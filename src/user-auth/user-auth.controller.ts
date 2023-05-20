/* eslint-disable no-console */
import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, Session, Get, UseGuards } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { RegisterUserDto } from './user-auth.dto'
import { Request, Response } from 'express'
import { LocalGuard, AuthenticatedGuard } from 'src/common/guards/local.guard'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'

@Controller('user-auth')
export class UserAuthController {
	constructor(private readonly userAuthService: UserAuthService) {}

	@UseGuards(LocalGuard)
	@Post('login')
	login(@GetUser() user: User) {
		return user
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	registerUser(@Body() signupUserDto: RegisterUserDto, @Req() req: Request) {
		return this.userAuthService.registerUser(signupUserDto, req)
	}

	@UseGuards(AuthenticatedGuard)
	@Post('logout')
	logout(@Req() req: Request, @Res() res: Response): void {
		console.log(req.session)
		req.logout(function (err) {
			if (err) {
				// Обробка помилки
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Помилка при виході з авторизації' })
				return
			}
			// Вихід з авторизації успішний
			res.status(HttpStatus.OK).json({ message: 'Вихід з авторизації успішно виконаний' })
		})
		console.log(req.session)
	}

	@UseGuards(AuthenticatedGuard)
	@Post('destroy')
	destroy(@Req() req: Request, @Res() res: Response): void {
		console.log(req.session)
		req.session.destroy(err => {
			if (err) {
				// Обробка помилки
				res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Помилка при знищенні сесії' })
				return
			}
			// Вихід з авторизації успішний
			res.status(HttpStatus.OK).json({ message: 'Сесія знищена' })
		})
		console.log(req.session)
	}

	@Get('')
	getAuthSession(@Session() session: Record<string, any>) {
		console.log(session)
		console.log(session)
		return session
	}
}
