import { Injectable, UseGuards } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { AuthenticatedGuard } from 'src/common/guards/local.guard'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	@UseGuards(AuthenticatedGuard)
	async getAllUsers() {
		const users = await this.prisma.user.findMany()
		users.map(user => delete user.passwordHash)
		return users
	}
}
