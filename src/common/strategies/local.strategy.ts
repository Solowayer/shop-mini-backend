import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { User } from '@prisma/client'
import * as argon from 'argon2'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private prisma: PrismaService) {
		super()
	}

	async validate(email: string, password: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { email } })
		if (!user) throw new NotFoundException('User not found')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new UnauthorizedException('Get out from here, boi')

		return user
	}
}
