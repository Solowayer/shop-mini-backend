import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateWishlistDto, UpdateWishlistDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { UserWishlist, Prisma, ProductToWishlist } from '@prisma/client'
import { ProductService } from 'src/product/product.service'
import { WishlistFullType } from 'lib/types/full-model.types'

@Injectable()
export class UserWishlistService {
	constructor(private prisma: PrismaService, @Inject(ProductService) private productService: ProductService) {}

	findAllWishlists(userId: number): Promise<UserWishlist[]> {
		return this.prisma.userWishlist.findMany({ where: { userId } })
	}

	async findOneWishlist(
		where: Prisma.UserWishlistWhereUniqueInput,
		wishlistSelect: Prisma.UserWishlistSelect = {}
	): Promise<WishlistFullType> {
		const defaultListSelect: Prisma.UserWishlistSelectScalar = {
			id: true,
			createdAt: false,
			updatedAt: false,
			name: true,
			userId: true
		}

		const wishlist = await this.prisma.userWishlist.findUnique({
			where,
			select: { ...defaultListSelect, ...wishlistSelect }
		})
		return wishlist
	}

	async findWishlistById(userId: number, listId: number): Promise<WishlistFullType> {
		const wishlist = await this.findOneWishlist({ id: listId })

		if (!wishlist || wishlist.userId !== userId) {
			throw new NotFoundException('List not found')
		}

		return wishlist
	}

	async createWishlist(userId: number, createWishlistDto: CreateWishlistDto): Promise<UserWishlist> {
		const { name } = createWishlistDto

		const newWishlist = await this.prisma.userWishlist.create({ data: { name, user: { connect: { id: userId } } } })
		return newWishlist
	}

	async updateWishlist(userId: number, listId: number, updateWishlistDto: UpdateWishlistDto): Promise<UserWishlist> {
		await this.findWishlistById(userId, listId)

		const updatedWishlist = await this.prisma.userWishlist.update({
			where: { id: listId },
			data: { ...updateWishlistDto }
		})

		return updatedWishlist
	}

	async deleteWishlist(userId: number, listId: number) {
		const wishlist = await this.findOneWishlist({ userId, id: listId })
		if (!wishlist) throw new NotFoundException('List not found')

		return this.prisma.userWishlist.delete({ where: { userId, id: listId } })
	}

	async addProductToWishlist(userId: number, listId: number, productId: number): Promise<ProductToWishlist> {
		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) throw new NotFoundException('Product not found')

		const wishlist = await this.findOneWishlist({ userId, id: listId })
		if (!wishlist) throw new NotFoundException('List not found')

		const existingProductInLists = await this.prisma.productToWishlist.findFirst({
			where: {
				wishlist: {
					userId
				},
				productId
			}
		})

		if (existingProductInLists) {
			throw new ConflictException('Product already exists in the list.')
		}

		return await this.prisma.productToWishlist.create({
			data: {
				product: { connect: { id: productId } },
				wishlist: { connect: { id: listId } }
			}
		})
	}

	async deleteProductFromWishlist(userId: number, productId: number): Promise<ProductToWishlist> {
		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) throw new NotFoundException('Product not found')

		const wishlist = await this.prisma.userWishlist.findFirst({
			where: {
				userId,
				products: { some: { productId } }
			}
		})

		if (!wishlist) {
			throw new NotFoundException('Product is not in any list.')
		}

		return await this.prisma.productToWishlist.delete({
			where: { productId_wishlistId: { productId, wishlistId: wishlist.id } }
		})
	}

	async checkProductInWishlist(userId: number, productId: number): Promise<{ isInList: boolean }> {
		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) {
			throw new NotFoundException('Product not found')
		}

		const wishlist = await this.prisma.userWishlist.findFirst({
			where: {
				userId,
				products: { some: { productId } }
			}
		})

		return { isInList: !!wishlist }
	}
}
