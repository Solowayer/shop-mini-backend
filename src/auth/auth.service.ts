/* eslint-disable no-console */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { LoginUserDto, RegisterUserDto } from './auth.dto'
import * as argon from 'argon2'
import { Request, Response } from 'express'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	async registerUser(registerUserDto: RegisterUserDto) {
		const { firstName, lastName, email, password, phoneNumber } = registerUserDto

		const existingUser = await this.userService.getOneUser({ email })
		if (existingUser) throw new BadRequestException('This email is already in use')

		const passwordHash = await argon.hash(password)

		const user = await this.prisma.user.create({
			data: {
				email,
				passwordHash,
				phoneNumber,
				role: 'USER',
				profile: {
					create: { firstName, lastName }
				}
			}
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
		if (!isMatch) throw new ForbiddenException('Wrong data')

		delete user.passwordHash

		return user
	}

	logout(req: Request, res: Response) {
		console.log(req.session)
		req.logout(function (err) {
			if (err) {
				throw new BadRequestException('Error at exit session')
			}
			res.send({ message: 'Logout complete' })
		})
		console.log(req.session)
	}

	destroy(req: Request, res: Response) {
		console.log(req.session)
		req.session.destroy(err => {
			if (err) {
				throw new BadRequestException('Error at destroy session')
			}
			res.send({ message: 'Сесія знищена' })
		})
		console.log(req.session)
	}
}
