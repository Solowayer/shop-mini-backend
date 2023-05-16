import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { SignupUserDto, SigninUserDto } from './user-auth.dto'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import { Response } from 'express'

@Injectable()
export class UserAuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signupUser(signupUserDto: SignupUserDto, res: Response) {
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

		const tokens = await this.signTokens(user.id, user.email)

		if (!tokens) {
			throw new ForbiddenException('No token here')
		}

		const { accessToken, refreshToken } = tokens

		await this.updateRtHash(user.id, refreshToken)

		res.cookie('rt-token', refreshToken, {
			maxAge: 60 * 60 * 24 * 7 * 1000,
			httpOnly: true,
			sameSite: 'strict'
		})
		res.send({ user, accessToken, refreshToken })
	}

	async signinUser(signinUserDto: SigninUserDto, res: Response) {
		const { emailOrPhoneNumber, password } = signinUserDto

		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] }
		})

		if (!user) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		const tokens = await this.signTokens(user.id, user.email)

		if (!tokens) {
			throw new ForbiddenException('No token here')
		}

		const { accessToken, refreshToken } = tokens

		await this.updateRtHash(user.id, refreshToken)

		res.cookie('rt-token', refreshToken, {
			maxAge: 60 * 60 * 1000,
			httpOnly: true,
			sameSite: 'strict'
		})
		res.send({ user, accessToken, refreshToken })
	}

	async signoutUser(userId: number, res: Response) {
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRt: { not: null }
			},
			data: {
				hashedRt: null
			}
		})

		res.clearCookie('rt-token')
		return res.send({ message: 'Signout successfully' })
	}

	async refreshTokens(userId: number, rt: string, res: Response) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId }
		})

		if (!user || !user.hashedRt) {
			throw new ForbiddenException('Access denied')
		}

		const rtMatches = argon.verify(user.hashedRt, rt)
		if (!rtMatches) throw new ForbiddenException('Access denied')

		const tokens = await this.signTokens(user.id, user.email)

		const { refreshToken } = tokens

		await this.updateRtHash(user.id, tokens.refreshToken)

		res.cookie('rt-token', refreshToken, {
			maxAge: 60 * 60 * 1000,
			httpOnly: true,
			sameSite: 'strict'
		})

		res.send(tokens)
	}

	async updateRtHash(userId: number, rt: string) {
		const hash = await argon.hash(rt)
		await this.prisma.user.update({ where: { id: userId }, data: { hashedRt: hash } })
	}

	private async signTokens(userId: number, email: string) {
		const payload = {
			sub: userId,
			email
		}

		const secretAt = this.config.get('JWT_ACCESS_USER_TOKEN_SECRET')
		const secretRt = this.config.get('REFRESH_TOKEN')

		const [at, rt] = await Promise.all([
			this.jwt.signAsync(payload, { secret: secretAt, expiresIn: 60 * 15 }),
			this.jwt.signAsync(payload, { secret: secretRt, expiresIn: 60 * 60 * 24 * 7 })
		])

		return { accessToken: at, refreshToken: rt }
	}
}
