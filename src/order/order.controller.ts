import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { CreateOrderDto } from './order.dto'
import { OrderService } from './order.service'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/decorators/user.decorator'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards()
	@Post()
	checkout(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
		return this.orderService.checkout(user.id, createOrderDto)
	}

	@UseGuards()
	@Get()
	findAllOrders() {
		return this.orderService.findAllOrders()
	}

	@UseGuards()
	@Get(':id')
	FindOrderById(@Param('id') id: string) {
		return this.orderService.findOrderById(+id)
	}
}
