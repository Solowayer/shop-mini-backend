import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { CreateOrderDto } from './dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	createOrder(@Body() createOrderDto: CreateOrderDto) {
		return this.orderService.createOrder(createOrderDto)
	}

	@Get()
	findAllOrders() {
		return this.orderService.findAllOrders()
	}

	@Get(':id')
	FindOrderById(@Param('id') id: string) {
		return this.orderService.findOrderById(+id)
	}
}
