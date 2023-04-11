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

	findAllProducts() {
		return this.prisma.product.findMany()
	}

	findProductById(id: number) {
		return this.prisma.product.findUnique({ where: { id } })
	}

	findProductBySlug(slug: string) {
		return this.prisma.product.findUnique({ where: { slug } })
	}

	updateProduct(id: number, updateProductDto: UpdateProductDto) {
		return this.prisma.product.update({ where: { id }, data: updateProductDto })
	}

	removeProduct(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}
}
