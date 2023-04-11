import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Product } from '@prisma/client'

@Injectable()
export class ProductsService {
	constructor(private prisma: PrismaService) {}

	async create(createProductDto: CreateProductDto): Promise<Product> {
		const { categoryId, sellerId, ...productData } = createProductDto
		const category: Category = await this.prisma.category.findUnique({
			where: { id: categoryId }
		})
		if (!category) {
			throw new NotFoundException('Category not found')
		}
		return this.prisma.product.create({
			data: {
				...productData,
				category: {
					connect: { id: category.id }
				}
			}
		})
	}

	findAll() {
		return `This action returns all products`
	}

	findById(id: number) {
		return `This action returns a id: #${id}`
	}

	findBySlug(slug: string) {
		return `This action returns a slug: #${slug}`
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`
	}

	remove(id: number) {
		return `This action removes a #${id} product`
	}
}
