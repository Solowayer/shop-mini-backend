import { Controller, Get } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Controller('products-on-lists')
export class ProductsOnListsController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	findAll() {
		return this.prisma.productsOnLists.findMany()
	}
}
