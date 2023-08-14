import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, FindAllProductsDto, ProductsSort, UpdateProductDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { Prisma, Product } from '@prisma/client'
import * as fs from 'fs'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryService } from 'src/category/category.service'
import { SellerService } from 'src/seller/seller.service'
import { ProductFullType } from 'lib/types/full-model.types'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		@Inject(PaginationService) private paginationService: PaginationService,
		@Inject(CategoryService) private categoryService: CategoryService,
		@Inject(SellerService) private sellerService: SellerService
	) {}

	async findAllProducts(
		findAllProductsDto: FindAllProductsDto,
		where: Prisma.ProductWhereInput = {}
	): Promise<{ products: Product[]; length: number }> {
		const { sort, min_price, max_price, q } = findAllProductsDto
		const { perPage, skip } = this.paginationService.getPagination(findAllProductsDto)

		const productSort: Prisma.ProductOrderByWithRelationInput = {
			price: sort === ProductsSort.LOW_PRICE ? 'asc' : sort === ProductsSort.HIGH_PRICE ? 'desc' : undefined,
			rating: sort === ProductsSort.RATING ? 'desc' : undefined,
			createdAt: sort === ProductsSort.NEWEST ? 'desc' : sort === ProductsSort.OLDEST ? 'asc' : undefined
		}

		const productFilter: Prisma.ProductWhereInput = {
			OR: [
				{ category: { name: { contains: q, mode: 'insensitive' } } },
				{ name: { contains: q, mode: 'insensitive' } }
			],
			price: { gte: min_price, lte: max_price }
		}

		const finalWhere: Prisma.ProductWhereInput = {
			...where,
			published: true,
			...productFilter
		}

		const products = await this.prisma.product.findMany({
			where: finalWhere,
			orderBy: productSort,
			skip,
			take: perPage
		})

		if (!products) throw new NotFoundException('Products doesn`t exist')

		const length = await this.prisma.product.count({
			where: finalWhere
		})

		return { products, length }
	}

	async findProductsByCategoryId(
		getAllProductsDto: FindAllProductsDto,
		categoryId: number
	): Promise<{ products: Product[]; length: number }> {
		const where: Prisma.ProductWhereInput = {
			categoryId
		}

		return await this.findAllProducts(getAllProductsDto, where)
	}

	async findProductsByCategoryTree(
		findAllProductsDto: FindAllProductsDto,
		categoryId: number
	): Promise<{ products: Product[]; length: number }> {
		const categoryTree = await this.categoryService.findCategoryTree(categoryId)
		if (!categoryTree) throw new NotFoundException('Category not found')

		const categoryIds = categoryTree.map(cat => cat.id)

		const where: Prisma.ProductWhereInput = {
			categoryId: { in: categoryIds }
		}

		return await this.findAllProducts(findAllProductsDto, where)
	}

	async findProductsByList(
		getAllProductsDto: FindAllProductsDto,
		wishlistId: number
	): Promise<{ products: Product[]; length: number }> {
		const productsOnLists = await this.prisma.wishlistProducts.findMany({ where: { wishlistId } })

		const productIds = productsOnLists.map(item => item.productId)

		const products = await this.findAllProducts(getAllProductsDto, { id: { in: productIds } })

		return products
	}

	async findSellerProducts(
		userId: number,
		getAllProductsDto: FindAllProductsDto
	): Promise<{ products: Product[]; length: number }> {
		const seller = await this.sellerService.getOneSeller({ userId }, { id: true })
		if (!seller) throw new NotFoundException('Seller not found')

		const where: Prisma.ProductWhereInput = {
			sellerId: seller.id
		}

		return await this.findAllProducts(getAllProductsDto, where)
	}

	async findOneProduct(
		uniqueArgs: Prisma.ProductWhereUniqueInput,
		select: Prisma.ProductSelect = {}
	): Promise<ProductFullType> {
		const defaultProductSelect: Prisma.ProductSelectScalar = {
			id: true,
			createdAt: false,
			updatedAt: false,
			slug: true,
			images: true,
			name: true,
			description: true,
			price: true,
			categoryId: true,
			sellerId: true,
			published: true,
			rating: true
		}

		const product = await this.prisma.product.findUnique({
			where: uniqueArgs,
			select: { ...defaultProductSelect, ...select }
		})

		return product
	}

	async findProductById(id: number): Promise<ProductFullType> {
		const product = await this.findOneProduct({ id })

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async findProductBySlug(slug: string): Promise<ProductFullType> {
		const product = await this.findOneProduct({ slug })

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async createProduct(createProductDto: CreateProductDto, userId?: number): Promise<Product> {
		const { categoryId, images, ...productData } = createProductDto

		if (images && images.length > 10) {
			throw new BadRequestException('Max 10 images')
		}

		const seller = await this.sellerService.getSellerByUserId(userId)

		const categoryExist = await this.categoryService.findOneCategory({ id: categoryId })
		if (!categoryExist) throw new NotFoundException('Category not found')

		const existingProduct = await this.findOneProduct({ slug: createProductDto.slug })
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

	async createManyProducts(createProductDtos: CreateProductDto[], userId?: number): Promise<Product[]> {
		const products: Product[] = []

		for (const createProductDto of createProductDtos) {
			const product = await this.createProduct(createProductDto, userId)
			products.push(product)
		}

		return products
	}

	async updateProduct(where: Prisma.ProductWhereUniqueInput, updateProductDto: UpdateProductDto): Promise<Product> {
		const product = await this.findOneProduct(where)
		if (!product) throw new NotFoundException('Product not found')

		return await this.prisma.product.update({ where, data: updateProductDto })
	}

	async deleteProduct(where: Prisma.ProductWhereUniqueInput) {
		const product = await this.findOneProduct(where)
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
