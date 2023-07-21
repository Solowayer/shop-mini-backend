import { Injectable } from '@nestjs/common'
import { ProductsOnLists } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class ProductsOnListsService {
	constructor(private prisma: PrismaService) {}

	getAllProductsOnLists(): Promise<ProductsOnLists[]> {
		return this.prisma.productsOnLists.findMany()
	}
}
