import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, GetAllProductsDto, ProductsSort, UpdateProductDto } from './product.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Prisma, Product } from '@prisma/client'
import * as fs from 'fs'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryService } from 'src/category/category.service'
import { SellerService } from 'src/seller/seller.service'
import { ProductFullType } from 'src/common/types/full-model.types'
import { productObject } from 'src/common/return-objects'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private categoryService: CategoryService,
		private sellerService: SellerService
	) {}

	async getAllProducts(getAllProductsDto: GetAllProductsDto): Promise<{ products: Product[]; length: number }> {
		const { sort, min_price, max_price, searchTerm, page, limit } = getAllProductsDto

		const { perPage, skip } = this.paginationService.getPagination({ page, limit })

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
				rating: sort === ProductsSort.RATING ? 'desc' : undefined,
				createdAt: sort === ProductsSort.NEWEST ? 'desc' : sort === ProductsSort.OLDEST ? 'asc' : undefined
			},
			skip,
			take: perPage
		})

		if (!products) throw new NotFoundException('Products doesn`t exist')

		const length = await this.prisma.product.count({
			where: {
				published: true,
				price: { gte: min_price, lte: max_price },
				OR: [
					{ category: { name: { contains: searchTerm, mode: 'insensitive' } } },
					{ name: { contains: searchTerm, mode: 'insensitive' } }
				]
			}
		})

		return { products, length }
	}

	async getOneProduct(
		uniqueArgs: Prisma.ProductWhereUniqueInput,
		selectProduct?: Prisma.ProductSelect
	): Promise<ProductFullType> {
		const product = await this.prisma.product.findUnique({
			where: uniqueArgs,
			select: { ...productObject, ...selectProduct }
		})

		return product
	}

	async getProductById(id: number): Promise<ProductFullType> {
		const product = await this.getOneProduct({ id })

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async getProductBySlug(slug: string): Promise<ProductFullType> {
		const product = await this.getOneProduct({ slug })

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
		console.log('CategoryId:', categoryId)

		const category = await this.categoryService.getOneCategory({ id: categoryId }, { children: true, _count: true })
		if (!category) throw new NotFoundException('Category not found')

		const categoryIds = [categoryId, ...category.children.map(parent => parent.id)]

		const products = await this.prisma.product.findMany({
			where: {
				OR: categoryIds.map(categoryId => ({ categoryId }))
			}
		})

		return products
	}

	async getProductsBySeller(userId: number): Promise<Product[]> {
		const seller = await this.sellerService.getOneSeller({ userId }, { products: true })
		if (!seller) throw new NotFoundException('Seller not found')

		return seller.products
	}

	async createProduct(createProductDto: CreateProductDto, userId?: number): Promise<Product> {
		const { categoryId, images, ...productData } = createProductDto

		if (images && images.length > 10) {
			throw new BadRequestException('Max 10 images')
		}

		const seller = await this.sellerService.getSellerByUser(userId)

		const categoryExist = await this.categoryService.getOneCategory({ id: categoryId })
		if (!categoryExist) throw new NotFoundException('Category not found')

		const existingProduct = await this.getOneProduct({ slug: createProductDto.slug })
		if (existingProduct) throw new BadRequestException(`Product with slug: ${productData.slug} already exist`)

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

	async updateProduct(where: Prisma.ProductWhereUniqueInput, updateProductDto: UpdateProductDto) {
		const product = await this.getOneProduct(where)
		if (!product) throw new NotFoundException('Product not found')

		return await this.prisma.product.update({ where, data: updateProductDto })
	}

	async removeProduct(where: Prisma.ProductWhereUniqueInput) {
		const product = await this.getOneProduct(where)
		if (!product) throw new NotFoundException('Product not found')

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

		return this.prisma.product.delete({ where })
	}
}
