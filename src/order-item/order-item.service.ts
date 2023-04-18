import { Injectable } from '@nestjs/common'
import { CreateOrderItemDto } from './dto'

@Injectable()
export class OrderItemService {
	create(createOrderItemDto: CreateOrderItemDto) {
		return 'This action adds a new orderItem'
	}

	findAll() {
		return `This action returns all orderItem`
	}

	findOne(id: number) {
		return `This action returns a #${id} orderItem`
	}

	remove(id: number) {
		return `This action removes a #${id} orderItem`
	}
}
