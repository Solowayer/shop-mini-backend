import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { SignupDto, SigninDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import * as argon from 'argon2'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async signup(signupDto: SignupDto) {
		const { username, email, password, phoneNumber } = signupDto

		const existingUser = await this.prisma.user.findUnique({ where: { email } })
		if (existingUser) throw new BadRequestException('Користувач з таким email вже існує')

		const passwordHash = await argon.hash(password)

		const newUser = await this.prisma.user.create({ data: { username, email, passwordHash, phoneNumber } })

		return newUser
	}

	async signin(signinDto: SigninDto) {
		const { email, password, phoneNumber } = signinDto

		const user = await this.prisma.user.findFirst({ where: { OR: [{ email }, { phoneNumber }] } })
		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		return user
	}
}
