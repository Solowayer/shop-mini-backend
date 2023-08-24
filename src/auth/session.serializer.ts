import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { UserFullType } from 'lib/types/full-model.types'

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private userService: UserService) {
		super()
	}

	serializeUser(user: UserFullType, done: (err: Error, user: UserFullType) => void): any {
		done(null, user)
	}
	async deserializeUser(user: UserFullType, done: (err: Error, user: UserFullType) => void) {
		const userDb = await this.userService.findOneUser({ id: user.id })
		// console.log('userDb:', userDb)

		return userDb ? done(null, userDb) : done(null, null)
	}
}
