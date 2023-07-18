import { Injectable } from '@nestjs/common'
import { CreateListDto, UpdateListDto } from './list.dto'
import { PrismaService } from 'prisma/prisma.service'
import { List } from '@prisma/client'

@Injectable()
export class ListService {
	constructor(private prisma: PrismaService) {}

	async createList(userId: number, createListDto: CreateListDto): Promise<List> {
		const { name, isDefault } = createListDto

		const list = await this.prisma.list.create({ data: { name, user: { connect: { id: userId } }, isDefault } })
		return list
	}

	findAll() {
		return `This action returns all list`
	}

	findOne(id: number) {
		return `This action returns a #${id} list`
	}

	update(id: number, updateListDto: UpdateListDto) {
		return `This action updates a #${id} list`
	}

	remove(id: number) {
		return `This action removes a #${id} list`
	}
}
