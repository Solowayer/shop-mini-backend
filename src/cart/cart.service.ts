import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Cart, CartItem } from '@prisma/client'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async getCart(userId: number): Promise<Cart> {
		const cart = await this.prisma.cart.findUnique({ where: { userId }, include: { cartItems: true } })
		if (!cart) return null

		const cartItems = cart.cartItems
		const totalAmount = cartItems.reduce((total, item) => total + item.price, 0)

		return await this.prisma.cart.update({
			where: { id: cart.id },
			data: { totalAmount },
			include: { cartItems: true }
		})
	}

	async addCartItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { productId, quantity } = createCartItemDto

		let cart = await this.prisma.cart.findUnique({ where: { userId } })
		if (!cart) cart = await this.prisma.cart.create({ data: { userId } })

		const product = await this.prisma.product.findUnique({ where: { id: productId } })
		if (!product) throw new NotFoundException('Такого товару не існує')

		const existingCartItem = await this.prisma.cartItem.findFirst({ where: { productId, cartId: cart.id } })

		if (existingCartItem) {
			const newQuantity = existingCartItem.quantity + quantity
			const newPrice = product.price * newQuantity

			return await this.prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					quantity: newQuantity,
					price: newPrice
				}
			})
		}

		const cartItem = await this.prisma.cartItem.create({
			data: {
				name: product.name,
				image: product.images[0],
				quantity,
				price: product.price * quantity,
				product: {
					connect: { id: product.id }
				},
				cart: {
					connect: { id: cart.id }
				}
			}
		})

		await this.getCart(userId)

		return cartItem
	}

	async removeCart(userId: number): Promise<Cart> {
		const existingCart = await this.prisma.cart.findUnique({ where: { userId } })
		if (!existingCart) throw new NotFoundException('Корзини не існує')

		return await this.prisma.cart.delete({ where: { userId } })
	}

	async updateCartItem(cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
		return await this.prisma.cartItem.update({
			where: { id: cartItemId },
			data: updateCartItemDto
		})
	}

	async deleteCartItem(cartItemId: number): Promise<CartItem> {
		const cartItem = await this.prisma.cartItem.findUnique({
			where: { id: cartItemId }
		})
		if (!cartItem) throw new NotFoundException('Такого товару в корзині не знайдено')

		const deletedCartItem = await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})

		const remainingCartItems = await this.prisma.cartItem.findMany({
			where: { cartId: cartItem.cartId }
		})

		if (remainingCartItems.length === 0) {
			await this.prisma.cart.delete({ where: { id: cartItem.cartId } })
		}

		const cart = await this.prisma.cart.findUnique({ where: { id: cartItem.cartId } })
		await this.getCart(cart.userId)

		return deletedCartItem
	}
}
