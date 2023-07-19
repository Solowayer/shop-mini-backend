import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateListDto, UpdateListDto } from './list.dto'
import { PrismaService } from 'prisma/prisma.service'
import { List } from '@prisma/client'

@Injectable()
export class ListService {
	constructor(private prisma: PrismaService) {}

	async createList(userId: number, createListDto: CreateListDto): Promise<List> {
		const { name } = createListDto

		const newList = await this.prisma.list.create({ data: { name, user: { connect: { id: userId } } } })
		return newList
	}

	async updateList(userId: number, listId: number, updateListDto: UpdateListDto): Promise<List> {
		await this.getOneList(userId, listId)

		const updatedList = await this.prisma.list.update({ where: { id: listId }, data: { ...updateListDto } })

		return updatedList
	}

	async getOneList(userId: number, listId: number) {
		const list = await this.prisma.list.findUnique({ where: { id: listId } })

		if (!list || list.userId !== userId) throw new NotFoundException('List not found')

		return list
	}

	findAll() {
		return `This action returns all list`
	}

	removeList(id: number) {
		return `This action removes a #${id} list`
	}
}
