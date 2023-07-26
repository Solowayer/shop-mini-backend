import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { CreateCartItemDto, UpdateCartItemDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { CartItem, Prisma } from '@prisma/client'
import { ProductService } from 'src/product/product.service'
import { CartItemFullType } from 'lib/types/full-model.types'
import { cartItemObject } from 'lib/return-objects'

@Injectable()
export class CartService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => ProductService))
		private productService: ProductService
	) {}

	async getAllCartItems(
		userId: number
	): Promise<{ cartItems: CartItem[]; totalAmount: number; totalQuantity: number }> {
		const cartItems = await this.prisma.cartItem.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } })

		const totalAmount = cartItems.reduce((total, item) => total + item.price, 0)
		const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

		return { cartItems, totalAmount, totalQuantity }
	}

	async getOneCartItem(
		userId: number,
		id: number,
		selectCartItem: Prisma.CartItemSelect = {}
	): Promise<CartItemFullType> {
		const cartItem = await this.prisma.cartItem.findUnique({
			where: { id, userId },
			select: { ...cartItemObject, ...selectCartItem }
		})

		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		return cartItem
	}

	async getCartItemByProductId(userId: number, productId: number): Promise<CartItemFullType> {
		const cartItem = await this.prisma.cartItem.findUnique({
			where: { productId_userId: { productId, userId } }
		})

		return cartItem
	}

	async deleteAllCartItems(userId: number) {
		const deletedCartItems = await this.prisma.cartItem.deleteMany({ where: { userId } })
		return deletedCartItems
	}

	async addCartItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { productId, quantity } = createCartItemDto

		const product = await this.productService.getOneProduct({ id: productId })
		if (!product) throw new NotFoundException('This product not found')

		const existingCartItem = await this.prisma.cartItem.findUnique({
			where: { productId_userId: { productId, userId } }
		})

		if (existingCartItem) {
			const newQuantity = existingCartItem.quantity + quantity
			const newPrice = product.price * newQuantity

			const cartItem = await this.prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					quantity: newQuantity,
					price: newPrice
				}
			})
			return cartItem
		} else {
			const cartItem = await this.prisma.cartItem.create({
				data: {
					name: product.name,
					image: product.images.length > 0 ? product.images[0] : null,
					quantity,
					price: product.price * quantity,
					product: {
						connect: { id: product.id }
					},
					user: {
						connect: { id: userId }
					}
				}
			})
			return cartItem
		}
	}

	async updateCartItem(userId: number, cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
		const cartItem = await this.getOneCartItem(userId, cartItemId, { product: { select: { price: true } } })

		const price = cartItem.product.price

		const updatedCartItem = await this.prisma.cartItem.update({
			where: { id: cartItemId, userId },
			data: { ...updateCartItemDto, price: price * updateCartItemDto.quantity }
		})

		return updatedCartItem
	}

	async deleteCartItem(userId: number, cartItemId: number): Promise<CartItem> {
		const cartItem = await this.prisma.cartItem.findUnique({
			where: { id: cartItemId, userId }
		})
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		const deletedCartItem = await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})

		return deletedCartItem
	}
}
