import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateOrderItemDto {
	@IsNumber()
	@IsNotEmpty()
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	orderId: number

	@IsNumber()
	@IsNotEmpty()
	productId: number
}
