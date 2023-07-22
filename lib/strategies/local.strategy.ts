import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import * as argon from 'argon2'
import { UserService } from 'src/user/user.service'
import { UserFullType } from '../types/full-model.types'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private userService: UserService) {
		super({
			usernameField: 'email'
		})
	}

	async validate(email: string, password: string): Promise<UserFullType> {
		// eslint-disable-next-line no-console
		// console.log(`Strategy: ${email}, ${password}`)

		const user = await this.userService.getOneUser({ email })

		if (!user) throw new NotFoundException('User not found')

		const isMatch = await argon.verify(user.passwordHash, password)
		if (!isMatch) throw new UnauthorizedException('Get out from here, boi')

		delete user.passwordHash

		return user
	}
}
