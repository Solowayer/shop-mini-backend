import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { OrderItemService } from './order-item.service'
import { CreateOrderItemDto } from './dto'

@Controller('order-item')
export class OrderItemController {
	constructor(private readonly orderItemService: OrderItemService) {}

	@Post()
	create(@Body() createOrderItemDto: CreateOrderItemDto) {
		return this.orderItemService.create(createOrderItemDto)
	}

	@Get()
	findAll() {
		return this.orderItemService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.orderItemService.findOne(+id)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.orderItemService.remove(+id)
	}
}
