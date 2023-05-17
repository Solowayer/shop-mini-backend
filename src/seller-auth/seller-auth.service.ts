import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import * as argon from 'argon2'
import { ConfigService } from '@nestjs/config'
import { SignupSellerDto, SigninSellerDto } from './seller-auth.dto'

@Injectable()
export class SellerAuthService {
	constructor(private prisma: PrismaService, private config: ConfigService) {}

	async signupSeller(signupSellerDto: SignupSellerDto) {
		const { name, adress, description, email, phoneNumber, password, pib } = signupSellerDto

		const existingSeller = await this.prisma.seller.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})
		if (existingSeller) throw new BadRequestException('Селлер з таким email або phoneNumber вже існує')

		const passwordHash = await argon.hash(password)

		const newSeller = await this.prisma.seller.create({
			data: { name, adress, description, email, phoneNumber, passwordHash, pib }
		})
	}

	async signinSeller(signinSellerDto: SigninSellerDto) {
		const { email, password } = signinSellerDto

		const seller = await this.prisma.seller.findUnique({ where: { email } })
		if (!seller) throw new ForbiddenException('Невірні дані')

		const isMatch = await argon.verify(seller.passwordHash, password)
		if (!isMatch) throw new ForbiddenException('Невірні дані')
	}
}
