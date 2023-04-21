import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { SignupSellerDto, SigninSellerDto } from './seller-auth.dto'

@Injectable()
export class SellerAuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signupSeller(signupSellerDto: SignupSellerDto) {
		const { name, adress, description, email, phoneNumber, password, pib } = signupSellerDto

		const existingSeller = await this.prisma.seller.findUnique({ where: { email } })
		if (existingSeller) throw new BadRequestException('Селлер з таким email вже існує')

		const passwordHash = await argon.hash(password)

		const newSeller = await this.prisma.seller.create({
			data: { name, adress, description, email, phoneNumber, passwordHash, pib }
		})

		const token = this.signToken(newSeller.id, newSeller.email)

		return token
	}

	async signinSeller(signinSellerDto: SigninSellerDto) {
		const { email, phoneNumber, password } = signinSellerDto

		const seller = await this.prisma.seller.findFirst({ where: { OR: [{ email }, { phoneNumber }] } })
		if (!seller) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(seller.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')

		const token = this.signToken(seller.id, seller.email)

		return token
	}

	private async signToken(sellerId: number, email: string): Promise<{ access_token: string }> {
		const payload = {
			sub: sellerId,
			email
		}

		const secret = this.config.get('JWT_ACCESS_TOKEN_SECRET')

		const accessToken = await this.jwt.signAsync(payload, { secret, expiresIn: '15m' })

		return { access_token: accessToken }
	}
}
