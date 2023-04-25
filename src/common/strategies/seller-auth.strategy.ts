import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-seller') {
	constructor(private prisma: PrismaService, config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get('JWT_ACCESS_SELLER_TOKEN_SECRET')
		})
	}

	async validate(payload: { sub: number; email: string }) {
		const seller = await this.prisma.seller.findUnique({ where: { id: payload.sub } })
		delete seller.passwordHash
		return seller
	}
}