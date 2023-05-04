import { Injectable } from '@nestjs/common'
import { CreateCartDto, UpdateCartDto } from './cart.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Cart } from '@prisma/client'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	async getCartByUserId(userId: number): Promise<Cart> {
		const cart = await this.prisma.cart.findUnique({ where: { userId } })
	}

	async createCart(authorizedUserId: number, createCartDto: CreateCartDto): Promise<Cart> {
		const { cartItems, ...cartData } = createCartDto

		const products = await this.prisma.product.findMany({
			where: { id: { in: cartItems.map(item => item.productId) } }
		})

		const prices = products.map(product => product.price)

		const totalAmount = 22334

		const cart = await this.prisma.cart.create({
			data: {
				...cartData,
				user: {
					connect: { id: authorizedUserId }
				},
				totalAmount,
				cartItems: {
					create: cartItems.map(item => ({
						quantity: item.quantity,
						product: { connect: { id: item.productId } }
					}))
				}
			}
		})

		return cart
	}

	updateCart(id: number, updateCartDto: UpdateCartDto) {
		return `This action updates a #${id} cart`
	}

	removeCart(id: number) {
		return `This action removes a #${id} cart`
	}
}
