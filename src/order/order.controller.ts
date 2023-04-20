import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { CreateOrderDto } from './dto'
import { OrderService } from './order.service'
import { JwtGuard } from 'src/user-auth/user-auth.guard'
import { User } from '@prisma/client'
import { GetUser } from 'src/user/user.decorator'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(JwtGuard)
	@Post()
	createOrder(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
		return this.orderService.createOrder(user.id, createOrderDto)
	}

	@UseGuards(JwtGuard)
	@Get()
	findAllOrders() {
		return this.orderService.findAllOrders()
	}

	@UseGuards(JwtGuard)
	@Get(':id')
	FindOrderById(@Param('id') id: string) {
		return this.orderService.findOrderById(+id)
	}
}
