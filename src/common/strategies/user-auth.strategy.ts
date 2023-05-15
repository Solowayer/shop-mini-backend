import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
	constructor(private prisma: PrismaService, config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get('JWT_ACCESS_USER_TOKEN_SECRET')
		})
	}

	async validate(payload: { sub: number; email: string }): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
		delete user.passwordHash
		return user
	}
}
