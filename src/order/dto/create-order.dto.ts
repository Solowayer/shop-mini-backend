import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { CreateOrderItemDto } from 'src/order-item/dto/create-order-item.dto'

export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	adress: string

	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	totalAmount: number

	@IsNotEmpty()
	orderItems: CreateOrderItemDto[]

	@IsNumber()
	userId: number

	@IsOptional()
	sellerId?: number
}
