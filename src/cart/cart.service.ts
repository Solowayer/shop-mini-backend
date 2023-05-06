import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Cart, CartItem } from '@prisma/client'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async getCart(userId: number): Promise<Cart> {
		const cart = await this.prisma.cart.findUnique({ where: { userId } })
		if (!cart) throw new NotFoundException('Корзина пуста')

		const totalAmount = await this.calculateTotalAmount(cart.id)

		return await this.prisma.cart.update({
			where: { id: cart.id },
			data: { totalAmount },
			include: { cartItems: true }
		})
	}

	async removeCart(userId: number): Promise<Cart> {
		return await this.prisma.cart.delete({ where: { userId } })
	}

	async addCartItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { productId, quantity } = createCartItemDto

		const cart = await this.createCart(userId)

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
				quantity,
				price: product.price,
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

		return await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})
	}

	private async createCart(userId: number): Promise<Cart> {
		const cart = await this.prisma.cart.findUnique({ where: { userId } })

		if (!cart)
			return await this.prisma.cart.create({
				data: {
					userId
				}
			})

		return cart
	}

	private async calculateTotalAmount(cartId: number): Promise<number> {
		const cartItems = await this.prisma.cartItem.findMany({ where: { cartId } })
		const totalAmount = cartItems.reduce((total, item) => total + item.price, 0)
		return totalAmount
	}
}
