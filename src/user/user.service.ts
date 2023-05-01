import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers() {
		const users = await this.prisma.user.findMany()
		users.map(user => delete user.passwordHash)
		return users
	}
}
