import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { SignupUserDto, SigninUserDto } from './user-auth.dto'
import * as argon from 'argon2'
import { Request } from 'express'

@Injectable()
export class UserAuthService {
	constructor(private prisma: PrismaService) {}

	async signupUser(signupUserDto: SignupUserDto, req) {
		const { username, email, password, phoneNumber } = signupUserDto

		const existingUser = await this.prisma.user.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})

		if (existingUser && phoneNumber !== null)
			throw new BadRequestException('Користувач з таким email або phoneNumber вже існує')

		const passwordHash = await argon.hash(password)

		const user = await this.prisma.user.create({
			data: { username, email, passwordHash, phoneNumber, role: 'USER' }
		})

		const sessionId = req.sessionID

		const session = await this.prisma.session.create({ data: { sessionId, user: { connect: { id: user.id } } } })

		delete user.passwordHash

		return { message: 'Успішно зареєстровано', user, session }
	}

	async signinUser(signinUserDto: SigninUserDto, req: Request) {
		const { emailOrPhoneNumber, password } = signinUserDto

		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] }
		})

		if (!user) throw new NotFoundException('Такого юзера не існує')

		const existingSession = await this.prisma.session.findFirst({ where: { userId: user.id } })
		if (existingSession) {
			await this.prisma.session.delete({ where: { id: existingSession.id } })
		}

		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		const sessionId = req.sessionID

		const session = await this.prisma.session.create({ data: { sessionId, user: { connect: { id: user.id } } } })

		delete user.passwordHash

		return { message: 'Успішно зареєстровано', user, session }
	}
}
