import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCartItemDto, UpdateCartItemDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { CartItem } from '@prisma/client'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async addCartItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { productId, quantity } = createCartItemDto

		const product = await this.prisma.product.findUnique({ where: { id: productId } })
		if (!product) throw new NotFoundException('This product not found')

		const existingCartItem = await this.prisma.cartItem.findFirst({ where: { productId } })

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
				image: product.images.length > 0 ? product.images[0] : null,
				quantity,
				price: product.price * quantity,
				product: {
					connect: { id: product.id }
				}
			}
		})

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
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		const deletedCartItem = await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})

		return deletedCartItem
	}
}
