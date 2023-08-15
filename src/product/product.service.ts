import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto, FindAllProductsDto, ProductsSort, UpdateProductDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { Prisma, Product, ProductVariation } from '@prisma/client'

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

	async findAll(
		findAllProductsDto: FindAllProductsDto,
		where: Prisma.ProductWhereInput = {}
	): Promise<{ products: Product[]; length: number }> {
		const { sort, min_price, max_price, q } = findAllProductsDto
		const { perPage, skip } = this.paginationService.getPagination(findAllProductsDto)

		const productSort: Prisma.ProductOrderByWithRelationInput = {
			rating: sort === ProductsSort.RATING ? 'desc' : undefined,
			createdAt: sort === ProductsSort.NEWEST ? 'desc' : sort === ProductsSort.OLDEST ? 'asc' : undefined
		}

		// const variationSort: Prisma.ProductVariationOrderByWithRelationInput = {
		// 	price: sort === ProductsSort.LOW_PRICE ? 'asc' : sort === ProductsSort.HIGH_PRICE ? 'desc' : undefined
		// }

		const productFilter: Prisma.ProductWhereInput = {
			OR: [
				{ category: { name: { contains: q, mode: 'insensitive' } } },
				{ name: { contains: q, mode: 'insensitive' } }
			],
			variations: {
				some: {
					AND: [{ price: { gte: min_price } }, { price: { lte: max_price } }]
				}
			}
		}

		const finalWhere: Prisma.ProductWhereInput = {
			...where,
			...productFilter
		}

		const products = await this.prisma.product.findMany({
			where: finalWhere,
			orderBy: productSort,
			// include: {
			// 	variations: { orderBy: variationSort }
			// },
			skip,
			take: perPage
		})

		if (!products) throw new NotFoundException('Products doesn`t exist')

		const length = await this.prisma.product.count({
			where: finalWhere
		})

		return { products, length }
	}

	// include: {
	// 	variations: {
	// 		orderBy: {
	// 			price: sort === ProductsSort.LOW_PRICE ? 'asc' : sort === ProductsSort.HIGH_PRICE ? 'desc' : undefined
	// 		},
	// 		take: 1 // Вибираємо лише одну варіацію для сортування за ціною
	// 	}
	// }

	async findByCategoryId(
		getAllProductsDto: FindAllProductsDto,
		categoryId: number
	): Promise<{ products: Product[]; length: number }> {
		const where: Prisma.ProductWhereInput = {
			categoryId
		}

		return await this.findAll(getAllProductsDto, where)
	}

	async findByCategoryTree(
		findAllProductsDto: FindAllProductsDto,
		categoryId: number
	): Promise<{ products: Product[]; length: number }> {
		const categoryTree = await this.categoryService.findCategoryTree(categoryId)
		if (!categoryTree) throw new NotFoundException('Category not found')

		const categoryIds = categoryTree.map(cat => cat.id)

		const where: Prisma.ProductWhereInput = {
			categoryId: { in: categoryIds }
		}

		return await this.findAll(findAllProductsDto, where)
	}

	async findByList(wishlistId: number): Promise<Product[]> {
		const productToWishlist = await this.prisma.productToWishlist.findMany({ where: { wishlistId } })

		const productVariationIds = productToWishlist.map(item => item.productId)

		const products = await this.prisma.product.findMany({
			where: { id: { in: productVariationIds } }
		})

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

		return await this.findAll(getAllProductsDto, where)
	}

	async findOne(
		uniqueArgs: Prisma.ProductWhereUniqueInput,
		selectProduct: Prisma.ProductSelect = {}
	): Promise<Product> {
		const defaultProductSelect: Prisma.ProductSelectScalar = {
			id: true,
			createdAt: false,
			updatedAt: false,
			slug: true,
			name: true,
			description: true,
			categoryId: true,
			sellerId: true,
			rating: true
		}

		const product = await this.prisma.product.findUnique({
			where: uniqueArgs,
			include: {
				variations: true
			}
		})

		return product
	}

	async findById(id: number): Promise<Product> {
		const product = await this.findOne({ id })

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async findBySlug(slug: string): Promise<Product> {
		const product = await this.findOne({ slug })

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async create(createProductDto: CreateProductDto, userId?: number): Promise<Product> {
		const { tags, categoryId, images, price, stock, attributes, ...productData } = createProductDto

		if (images && images.length > 10) {
			throw new BadRequestException('Max 10 images')
		}

		const seller = await this.sellerService.getSellerByUserId(userId)

		const categoryExist = await this.categoryService.findOneCategory({ id: categoryId })
		if (!categoryExist) throw new NotFoundException('Category not found')

		const existingProduct = await this.findOne({ slug: createProductDto.slug })
		if (existingProduct) throw new BadRequestException(`Product with slug: ${productData.slug} already exist`)

		const product = await this.prisma.product.create({
			data: {
				...productData,
				tags: {
					createMany: { data: tags.map(tag => ({ name: tag })) }
				},
				category: categoryExist && { connect: { id: categoryExist.id } },
				seller: userId && { connect: { id: seller.id } },
				variations: {
					create: {
						images,
						price,
						stock,
						attributes: {
							create: attributes.map(attr => ({
								value: attr.value,
								attribute: { connect: { id: attr.attributeId } }
							}))
						}
					}
				}
			}
		})

		return product
	}

	async createMany(createProductDtos: CreateProductDto[], userId?: number): Promise<Product[]> {
		const products: Product[] = []

		for (const createProductDto of createProductDtos) {
			const product = await this.create(createProductDto, userId)
			products.push(product)
		}

		return products
	}

	async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
		const { tags } = updateProductDto

		await this.prisma.tag.deleteMany({ where: { productId: id } })

		const updatedProduct = await this.prisma.product.update({
			where: { id },
			data: {
				...updateProductDto,
				tags: { createMany: { data: tags.map(tag => ({ name: tag })) } }
			}
		})

		return updatedProduct
	}

	async delete(id: number) {
		const product = await this.findOne({ id })
		if (!product) throw new NotFoundException('Product not found')

		return this.prisma.product.delete({ where: { id } })
	}
}
