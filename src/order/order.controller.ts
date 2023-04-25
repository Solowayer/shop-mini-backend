import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { CreateOrderDto } from './order.dto'
import { OrderService } from './order.service'
import { JwtUserGuard } from 'src/common/guards/jwt.guard'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/decorators/user.decorator'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(JwtUserGuard)
	@Post()
	createOrder(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
		return this.orderService.createOrder(user.id, createOrderDto)
	}

	@UseGuards(JwtUserGuard)
	@Get()
	findAllOrders() {
		return this.orderService.findAllOrders()
	}

	@UseGuards(JwtUserGuard)
	@Get(':id')
	FindOrderById(@Param('id') id: string) {
		return this.orderService.findOrderById(+id)
	}
}
