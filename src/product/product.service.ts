import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, GetAllProductsDto, ProductsSort, UpdateProductDto } from './product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Product } from '@prisma/client'
import * as fs from 'fs'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAllProducts(getAllProductsDto: GetAllProductsDto): Promise<Product[]> {
		const { sort, min_price, max_price, searchTerm } = getAllProductsDto

		const products = await this.prisma.product.findMany({
			where: {
				published: true,
				price: { gte: min_price, lte: max_price },
				OR: [
					{ category: { name: { contains: searchTerm, mode: 'insensitive' } } },
					{ name: { contains: searchTerm, mode: 'insensitive' } }
				]
			},
			orderBy: {
				price: sort === ProductsSort.LOW_PRICE ? 'asc' : sort === ProductsSort.HIGH_PRICE ? 'desc' : undefined,
				rating: sort === ProductsSort.RATING ? 'desc' : undefined
			}
		})

		if (!products) throw new NotFoundException('Products doesn`t exist')

		return products
	}

	async getProductById(id: number) {
		const product = await this.prisma.product.findUnique({ where: { id } })

		if (!product) {
			throw new NotFoundException(`Product with id "${id}" not found`)
		}

		return product
	}

	async getProductBySlug(slug: string): Promise<Product> {
		const product = await this.prisma.product.findUnique({ where: { slug } })

		if (!product) {
			throw new NotFoundException(`Product with slug "${slug}" not found`)
		}

		return product
	}

	async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
		console.log('CategoryId:', categoryId)

		const category = await this.prisma.category.findUnique({ where: { id: categoryId }, select: { children: true } })

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		const categoryIds = [categoryId, ...category.children.map(parent => parent.id)]

		const products = await this.prisma.product.findMany({
			where: {
				OR: categoryIds.map(categoryId => ({ categoryId }))
			}
		})

		return products
	}

	async getMaxPrice(): Promise<{ maxPrice: number }> {
		const productWithMaxPrice = await this.prisma.product.findFirst({
			orderBy: {
				price: 'desc'
			}
		})

		if (!productWithMaxPrice) throw new NotFoundException('Немає товарів')

		return { maxPrice: productWithMaxPrice.price }
	}

	async createProduct(createProductDto: CreateProductDto, userId?: number): Promise<Product> {
		const { categoryId, images, ...productData } = createProductDto

		if (images && images.length > 10) {
			throw new BadRequestException('Перевищено допустиму кількість зображень (максимум 10).')
		}

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
				seller: userId && { connect: { id: seller.id } },
				images: images || []
			}
		})

		return product
	}

	async updateProduct(id: number, updateProductDto: UpdateProductDto) {
		return await this.prisma.product.update({ where: { id }, data: updateProductDto })
	}

	async removeProduct(id: number) {
		const product = await this.prisma.product.findUnique({ where: { id } })

		const productImages = product.images

		if (productImages) {
			for (const imageUrl of productImages) {
				const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

				const imagePath = `uploads/images/${imageName}`
				try {
					await fs.promises.unlink(imagePath)
					console.log(`Видалено файл: ${imageUrl}`)
				} catch (error) {
					console.log(`Помилка при видаленні файлу: ${imageUrl}`, error)
				}
			}
		}

		return this.prisma.product.delete({ where: { id } })
	}
}
