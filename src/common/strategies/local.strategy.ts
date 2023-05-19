import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { User } from '@prisma/client'
import * as argon from 'argon2'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private prisma: PrismaService) {
		super({
			usernameField: 'emailOrPhoneNumber'
		})
	}

	async validate(emailOrPhoneNumber: string, password: string): Promise<User> {
		console.log(`Strategy: ${emailOrPhoneNumber} ${password}`)

		const user = await this.prisma.user.findFirst({
			where: { OR: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }] }
		})

		if (!user) throw new NotFoundException('User not found')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new UnauthorizedException('Get out from here, boi')

		delete user.passwordHash

		return user
	}
}
