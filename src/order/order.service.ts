import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
		const { orderItems, userId, adress, totalAmount } = createOrderDto

		const order = await this.prisma.order.create({
			data: {
				user: {
					connect: { id: userId }
				},
				adress,
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

	findAll() {
		return `This action returns all order`
	}

	findOne(id: number) {
		return `This action returns a #${id} order`
	}

	update(id: number, updateOrderDto: UpdateOrderDto) {
		return `This action updates a #${id} order`
	}

	remove(id: number) {
		return `This action removes a #${id} order`
	}
}
