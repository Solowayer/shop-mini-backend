/* eslint-disable no-console */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { LoginUserDto, RegisterUserDto } from './auth.dto'
import * as argon from 'argon2'
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async registerUser(registerUserDto: RegisterUserDto) {
		const { username, email, password, phoneNumber } = registerUserDto

		const existingUser = await this.prisma.user.findUnique({
			where: { email },
			include: { seller: true }
		})

		if (existingUser) throw new BadRequestException('This email is already in use')

		const passwordHash = await argon.hash(password)

		const user = await this.prisma.user.create({
			data: { username, email, passwordHash, phoneNumber, role: 'USER' }
		})

		delete user.passwordHash

		return user
	}

	async loginUser(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto

		const user = await this.prisma.user.findUnique({
			where: { email },
			include: { seller: true }
		})

		if (!user) throw new NotFoundException('This user doesn`t exist')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		delete user.passwordHash

		return user
	}

	logout(req: Request, res: Response) {
		console.log(req.session)
		req.logout(function (err) {
			if (err) {
				throw new BadRequestException('Помилка при виході із сесії')
			}
			res.send({ message: 'Вихід з авторизації успішно виконаний' })
		})
		console.log(req.session)
	}

	destroy(req: Request, res: Response) {
		console.log(req.session)
		req.session.destroy(err => {
			if (err) {
				throw new BadRequestException('Помилка при знищенні сесії')
			}
			res.send({ message: 'Сесія знищена' })
		})
		console.log(req.session)
	}
}
