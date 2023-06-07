import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, ProductsFilterDto, ProductsSortDto, UpdateProductDto } from './product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Product } from '@prisma/client'

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

		if (!products) throw new NotFoundException('Немає товарів')

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
		const products = await this.prisma.product.findMany({
			where: { categories: { some: { category: { id: categoryId } } } }
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

	async createProduct(createProductDto: CreateProductDto): Promise<Product> {
		const { categoryId, ...productData } = createProductDto

		const categoryExist: Category = categoryId
			? await this.prisma.category.findUnique({ where: { id: categoryId } })
			: null
		if (!categoryExist) throw new NotFoundException('Такої категорії не існує')

		const existingProduct = await this.prisma.product.findUnique({ where: { slug: createProductDto.slug } })
		if (existingProduct) throw new BadRequestException('Такий товар вже існує')

		const categories: Category[] = []
		categories.push(categoryExist)
		await this.addParentCategories(categoryExist, categories)

		const product = await this.prisma.product.create({
			data: {
				...productData,
				categories: { create: categories.map(category => ({ category: { connect: { id: category.id } } })) }
				// seller: sellerId && { connect: { id: sellerId } }
			},
			include: {
				categories: true
			}
		})

		return product
	}

	private async addParentCategories(category: Category, categories: Category[]): Promise<void> {
		if (category.parentId) {
			const parentCategory = await this.prisma.category.findUnique({ where: { id: category.parentId } })
			if (parentCategory) {
				categories.push(parentCategory)
				await this.addParentCategories(parentCategory, categories)
			}
		}
	}

	updateProduct(id: number, updateProductDto: UpdateProductDto) {
		return this.prisma.product.update({ where: { id }, data: updateProductDto })
	}

	removeProduct(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}
}
