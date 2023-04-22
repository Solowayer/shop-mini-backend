import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Product } from '@prisma/client'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async createProduct(createProductDto: CreateProductDto, sellerId?: number): Promise<Product> {
		const { categoryId, ...productData } = createProductDto

		const category: Category = categoryId ? await this.prisma.category.findUnique({ where: { id: categoryId } }) : null

		if (categoryId && !category) throw new NotFoundException('Такої категорії не існує')

		const existingProduct = await this.prisma.product.findUnique({ where: { slug: createProductDto.slug } })
		if (existingProduct) throw new BadRequestException('Такий товар вже існує')

		const product = await this.prisma.product.create({
			data: {
				...productData,
				category: category && { connect: { id: category.id } },
				seller: sellerId && { connect: { id: sellerId } }
			}
		})

		return product
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
