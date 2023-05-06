import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOrderDto } from './order.dto'
import { Order } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async checkout(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
		const { adress, recipient } = createOrderDto

		const cart = await this.prisma.cart.findUnique({ where: { userId }, include: { cartItems: true } })

		if (!cart) throw new NotFoundException('Корзини не існує')

		const cartItems = cart.cartItems

		const order = await this.prisma.order.create({
			data: {
				recipient,
				adress,
				user: { connect: { id: userId } },
				totalAmount: cart.totalAmount,
				orderItems: {
					create: cartItems.map(item => ({
						product: { connect: { id: item.productId } },
						quantity: item.quantity,
						price: item.price * item.quantity
					}))
				}
			},
			include: {
				orderItems: {
					include: {
						product: true
					}
				}
			}
		})

		return order
	}

	findAllOrders() {
		return this.prisma.order.findMany()
	}

	findOrderById(id: number) {
		return this.prisma.order.findUnique({ where: { id } })
	}
}
