import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class ProductsService {
	constructor(private prisma: PrismaService) {}

	create(createProductDto: CreateProductDto) {
		return this.prisma.product.create({ data: createProductDto })
	}

	findAll() {
		return `This action returns all products`
	}

	findOne(id: number) {
		return `This action returns a #${id} product`
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`
	}

	remove(id: number) {
		return `This action removes a #${id} product`
	}
}
