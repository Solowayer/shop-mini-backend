import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCartDto, CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Cart, CartItem } from '@prisma/client'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async getCartByUserId(userId: number): Promise<Cart> {
		const cart = await this.prisma.cart.findUnique({ where: { userId } })
		if (!cart) {
			return await this.createCart(userId)
		}
		return cart
	}

	async addCartItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { productId, quantity } = createCartItemDto
		const cart = await this.getCartByUserId(userId)
		const product = await this.prisma.product.findUnique({ where: { id: productId } })

		if (!product) throw new NotFoundException('Такого товару не існує')

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

		const totalAmount = await this.calculateTotalAmount(cart.id)

		await this.prisma.cart.update({ where: { id: cart.id }, data: { totalAmount } })

		return cartItem
	}

	async updateCartItem(cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
		return await this.prisma.cartItem.update({
			where: { id: cartItemId },
			data: updateCartItemDto
		})
	}

	async deleteCartItem(cartItemId: number): Promise<CartItem> {
		return await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})
	}

	private async createCart(userId: number): Promise<Cart> {
		const cart = await this.prisma.cart.create({
			data: {
				userId
			}
		})

		return cart
	}

	private async calculateTotalAmount(cartId: number): Promise<number> {
		const cartItems = await this.prisma.cartItem.findMany({ where: { cartId } })
		const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
		return totalAmount
	}
}
