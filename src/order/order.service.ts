import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './order.dto'
import { Order } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async createOrder(authorizedUserId: number, createOrderDto: CreateOrderDto): Promise<Order> {
		const { orderItems, ...orderData } = createOrderDto

		const orderItemsWithPrice = await Promise.all(
			orderItems.map(async item => {
				const { price } = await this.prisma.product.findUnique({
					where: { id: item.productId }
				})

				return {
					...item,
					price
				}
			})
		)

		const totalAmount = orderItemsWithPrice.reduce((total, item) => total + item.price * item.quantity, 0)

		const order = await this.prisma.order.create({
			data: {
				...orderData,
				user: {
					connect: { id: authorizedUserId }
				},
				totalAmount,
				orderItems: {
					create: orderItems.map(item => {
						return {
							quantity: item.quantity,
							product: {
								connect: { id: item.productId }
							}
						}
					})
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
