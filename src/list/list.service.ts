import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateListDto, UpdateListDto } from './list.dto'
import { PrismaService } from 'prisma/prisma.service'
import { List, Prisma } from '@prisma/client'
import { listObject } from 'src/common/return-objects'
import { ListFullType } from 'src/common/types/full-model.types'

@Injectable()
export class ListService {
	constructor(private prisma: PrismaService) {}

	async createList(userId: number, createListDto: CreateListDto): Promise<List> {
		const { name } = createListDto

		const newList = await this.prisma.list.create({ data: { name, user: { connect: { id: userId } } } })
		return newList
	}

	async updateList(userId: number, listId: number, updateListDto: UpdateListDto): Promise<List> {
		await this.getListById(userId, listId)

		const updatedList = await this.prisma.list.update({ where: { id: listId }, data: { ...updateListDto } })

		return updatedList
	}

	async removeList(userId: number, listId: number) {
		await this.getListById(userId, listId)

		return this.prisma.list.delete({ where: { id: listId } })
	}

	async getOneList(listId: number, selectList: Prisma.ListSelect = {}): Promise<ListFullType> {
		const list = await this.prisma.list.findUnique({ where: { id: listId }, select: { ...listObject, ...selectList } })
		return list
	}

	async getListById(userId: number, listId: number): Promise<ListFullType> {
		const list = await this.getOneList(listId, { products: true })

		if (!list || list.userId !== userId) {
			throw new NotFoundException('List not found')
		}

		return list
	}

	findAllLists(userId: number): Promise<List[]> {
		return this.prisma.list.findMany({ where: { userId } })
	}

	async addProductToList(userId: number, listId: number, productId: number): Promise<List> {
		await this.getListById(userId, listId)

		const updatedList = await this.prisma.list.update({
			where: { id: listId },
			data: {
				products: {
					connect: { id: productId }
				}
			},
			include: { products: true }
		})

		return updatedList
	}
}
