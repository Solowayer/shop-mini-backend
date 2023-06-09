import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private prisma: PrismaService) {
		super()
	}

	serializeUser(user: User, done: (err: Error, user: User) => void): any {
		done(null, user)
	}
	async deserializeUser(user: User, done: (err: Error, user: User) => void) {
		const userDb = await this.prisma.user.findUnique({ where: { id: user.id } })
		return userDb ? done(null, userDb) : done(null, null)
	}
}
