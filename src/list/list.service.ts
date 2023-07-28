import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateListDto, UpdateListDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { List, Prisma, ProductsOnLists } from '@prisma/client'
import { ProductService } from 'src/product/product.service'
// import { ListFullType } from 'lib/types/full-model.types'

@Injectable()
export class ListService {
	constructor(private prisma: PrismaService, @Inject(ProductService) private productService: ProductService) {}

	findAllLists(userId: number): Promise<List[]> {
		return this.prisma.list.findMany({ where: { userId } })
	}

	async findOneList(where: Prisma.ListWhereUniqueInput): Promise<List> {
		const list = await this.prisma.list.findUnique({ where })
		return list
	}

	async findListById(userId: number, listId: number): Promise<List> {
		const list = await this.findOneList({ id: listId })

		if (!list || list.userId !== userId) {
			throw new NotFoundException('List not found')
		}

		return list
	}

	async createList(userId: number, createListDto: CreateListDto): Promise<List> {
		const { name } = createListDto

		const newList = await this.prisma.list.create({ data: { name, user: { connect: { id: userId } } } })
		return newList
	}

	async updateList(userId: number, listId: number, updateListDto: UpdateListDto): Promise<List> {
		await this.findListById(userId, listId)

		const updatedList = await this.prisma.list.update({ where: { id: listId }, data: { ...updateListDto } })

		return updatedList
	}

	async deleteList(userId: number, listId: number) {
		const list = await this.findOneList({ userId, id: listId })
		if (!list) throw new NotFoundException('List not found')

		return this.prisma.list.delete({ where: { id: listId } })
	}

	async addProductToList(userId: number, listId: number, productId: number): Promise<ProductsOnLists> {
		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) throw new NotFoundException('Product not found')

		const list = await this.findOneList({ userId, id: listId })
		if (!list) throw new NotFoundException('List not found')

		return await this.prisma.productsOnLists.create({
			data: {
				product: { connect: { id: productId } },
				list: { connect: { id: listId } }
			}
		})
	}

	async deleteProductFromList(userId: number, listId: number, productId: number): Promise<ProductsOnLists> {
		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) throw new NotFoundException('Product not found')

		const list = await this.findOneList({ userId, id: listId })
		if (!list) throw new NotFoundException('List not found')

		return await this.prisma.productsOnLists.delete({
			where: { productId_listId: { productId, listId } }
		})
	}
}
