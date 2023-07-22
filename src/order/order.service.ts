import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOrderDto } from './dto'
import { Order } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async checkout(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
		const { adress, recipient } = createOrderDto

		const order = await this.prisma.order.create({
			data: {
				recipient,
				adress,
				user: { connect: { id: userId } }
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
