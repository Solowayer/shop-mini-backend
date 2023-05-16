import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

export type RtPayload = {
	sub: number
	email: string
	refreshToken: string
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh') {
	constructor(private config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get('REFRESH_TOKEN'),
			passReqToCallback: true
		})
	}

	validate(req: Request, payload: any) {
		const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
		return { ...payload, refreshToken }
	}
}

