import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, ProductsFilterDto, ProductsSortDto, UpdateProductDto } from './product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Product } from '@prisma/client'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async createProduct(createProductDto: CreateProductDto, sellerId?: number): Promise<Product> {
		const { categoryId, ...productData } = createProductDto

		const categoryExist: Category = categoryId
			? await this.prisma.category.findUnique({ where: { id: categoryId } })
			: null
		if (!categoryExist) throw new NotFoundException('Такої категорії не існує')

		const existingProduct = await this.prisma.product.findUnique({ where: { slug: createProductDto.slug } })
		if (existingProduct) throw new BadRequestException('Такий товар вже існує')

		const product = await this.prisma.product.create({
			data: {
				...productData,
				category: categoryExist && { connect: { id: categoryExist.id } },
				seller: sellerId && { connect: { id: sellerId } }
			}
		})

		return product
	}

	async findAllProducts(minPrice: number, maxPrice: number, productSortDto: ProductsSortDto): Promise<Product[]> {
		const { sort } = productSortDto

		let products = await this.prisma.product.findMany({
			where: {
				published: true
			}
		})

		if (sort === 'price_asc') products = await this.prisma.product.findMany({ orderBy: { price: 'asc' } })
		if (sort === 'price_desc') products = await this.prisma.product.findMany({ orderBy: { price: 'desc' } })

		if (minPrice && maxPrice)
			products = await this.prisma.product.findMany({
				where: {
					price: {
						gte: minPrice,
						lte: maxPrice
					}
				}
			})

		if (maxPrice) products = await this.prisma.product.findMany({ where: { price: { lte: maxPrice } } })
		if (minPrice) products = await this.prisma.product.findMany({ where: { price: { gte: minPrice } } })

		return products
	}

	findProductById(id: number) {
		const product = this.prisma.product.findUnique({ where: { id } })

		if (!product) {
			throw new NotFoundException(`Product with id "${id}" not found`)
		}

		return product
	}

	findProductBySlug(slug: string): Promise<Product> {
		const product = this.prisma.product.findUnique({ where: { slug } })

		if (!product) {
			throw new NotFoundException(`Product with slug "${slug}" not found`)
		}

		return product
	}

	updateProduct(id: number, updateProductDto: UpdateProductDto) {
		return this.prisma.product.update({ where: { id }, data: updateProductDto })
	}

	removeProduct(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}
}
