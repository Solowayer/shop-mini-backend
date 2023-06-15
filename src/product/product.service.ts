import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, ProductsFilterDto, ProductsSortDto, UpdateProductDto } from './product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Product } from '@prisma/client'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAllProducts(productSortDto: ProductsSortDto, productsFilterDto: ProductsFilterDto): Promise<Product[]> {
		const { sort } = productSortDto
		const { min_price, max_price, search } = productsFilterDto

		const products = await this.prisma.product.findMany({
			where: {
				published: true,
				price: { gte: min_price, lte: max_price },
				name: { contains: search }
			},
			orderBy: {
				price: sort === 'price_asc' ? 'asc' : sort === 'price_desc' ? 'desc' : undefined,
				rating: sort === 'rating' ? 'desc' : undefined
			}
		})

		if (!products) throw new NotFoundException('Products doesn`t exist')

		return products
	}

	getProductById(id: number) {
		const product = this.prisma.product.findUnique({ where: { id } })

		if (!product) {
			throw new NotFoundException(`Product with id "${id}" not found`)
		}

		return product
	}

	getProductBySlug(slug: string): Promise<Product> {
		const product = this.prisma.product.findUnique({ where: { slug } })

		if (!product) {
			throw new NotFoundException(`Product with slug "${slug}" not found`)
		}

		return product
	}

	async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
		const category = await this.prisma.category.findUnique({ where: { id: categoryId }, include: { childrens: true } })

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		const categoryIds = [categoryId, ...category.childrens.map(parent => parent.id)]

		const products = await this.prisma.product.findMany({
			where: {
				OR: categoryIds.map(categoryId => ({ categoryId }))
			}
		})

		return products
	}

	async getMaxPrice(): Promise<{ productsMaxPrice: number }> {
		const productWithMaxPrice = await this.prisma.product.findFirst({
			orderBy: {
				price: 'desc'
			}
		})

		if (!productWithMaxPrice) throw new NotFoundException('Немає товарів')

		return { productsMaxPrice: productWithMaxPrice.price }
	}

	async createProduct(createProductDto: CreateProductDto, userId?: number): Promise<Product> {
		const { categoryId, ...productData } = createProductDto

		const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { seller: true } })
		if (userId && !user) throw new BadRequestException('Такого юзера не існує')

		const seller = user.seller

		const categoryExist = await this.prisma.category.findUnique({ where: { id: categoryId } })

		if (!categoryExist) throw new NotFoundException('Такої категорії не існує')

		const existingProduct = await this.prisma.product.findUnique({ where: { slug: createProductDto.slug } })
		if (existingProduct) throw new BadRequestException('Такий товар вже існує')

		const product = await this.prisma.product.create({
			data: {
				...productData,
				category: categoryExist && { connect: { id: categoryExist.id } },
				seller: userId && { connect: { id: seller.id } }
			}
		})

		return product
	}

	updateProduct(id: number, updateProductDto: UpdateProductDto) {
		return this.prisma.product.update({ where: { id }, data: updateProductDto })
	}

	removeProduct(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}
}
