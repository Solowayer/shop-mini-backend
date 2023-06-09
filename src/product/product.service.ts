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

	async getAllProducts(
		getAllProductsDto: GetAllProductsDto,
		where: Prisma.ProductWhereInput = {}
	): Promise<{ products: Product[]; length: number }> {
		const { sort, min_price, max_price, searchTerm } = getAllProductsDto
		const { perPage, skip } = this.paginationService.getPagination(getAllProductsDto)

		const productSort: Prisma.ProductOrderByWithRelationInput = {
			price: sort === ProductsSort.LOW_PRICE ? 'asc' : sort === ProductsSort.HIGH_PRICE ? 'desc' : undefined,
			rating: sort === ProductsSort.RATING ? 'desc' : undefined,
			createdAt: sort === ProductsSort.NEWEST ? 'desc' : sort === ProductsSort.OLDEST ? 'asc' : undefined
		}

		const productFilter: Prisma.ProductWhereInput = {
			OR: [
				{ category: { name: { contains: searchTerm, mode: 'insensitive' } } },
				{ name: { contains: searchTerm, mode: 'insensitive' } }
			],
			price: { gte: min_price, lte: max_price }
		}

		const products = await this.prisma.product.findMany({
			where: {
				...where,
				published: true,
				...productFilter
			},
			orderBy: productSort,
			skip,
			take: perPage
		})

		if (!products) throw new NotFoundException('Products doesn`t exist')

		const length = await this.prisma.product.count({
			where: { ...where, published: true, ...productFilter }
		})

		return { products, length }
	}

	async getProductsByCategoryId(
		categoryId: number,
		getAllProductsDto: GetAllProductsDto
	): Promise<{ products: Product[]; length: number }> {
		console.log('CategoryId:', categoryId)

		const where: Prisma.ProductWhereInput = {
			categoryId
		}

		return await this.getAllProducts(getAllProductsDto, where)
	}

	async getProductsByCategoryTree(
		categoryId: number,
		getAllProductsDto: GetAllProductsDto
	): Promise<{ products: Product[]; length: number }> {
		const categoryTree = await this.categoryService.getCategoryTree(categoryId)
		if (!categoryTree) throw new NotFoundException('Category not found')

		const categoryIds = categoryTree.map(cat => cat.id)

		const where: Prisma.ProductWhereInput = {
			categoryId: { in: categoryIds }
		}

		return await this.getAllProducts(getAllProductsDto, where)
	}

	async getSellerProducts(userId: number): Promise<Product[]> {
		const seller = await this.sellerService.getOneSeller({ userId }, { products: true })

		if (!seller) throw new NotFoundException('Seller not found')

		return seller.products
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

	async createProduct(createProductDto: CreateProductDto, userId?: number): Promise<Product> {
		const { categoryId, images, ...productData } = createProductDto

		if (images && images.length > 10) {
			throw new BadRequestException('Max 10 images')
		}

		const seller = await this.sellerService.getSellerByUserId(userId)

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

	async updateProduct(where: Prisma.ProductWhereUniqueInput, updateProductDto: UpdateProductDto): Promise<Product> {
		const product = await this.getOneProduct(where)
		if (!product) throw new NotFoundException('Product not found')

		return await this.prisma.product.update({ where, data: updateProductDto })
	}

	async deleteProduct(where: Prisma.ProductWhereUniqueInput) {
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
