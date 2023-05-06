import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class OrderItemDto {
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

export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	recipient: string

	@IsString()
	@IsNotEmpty()
	adress: string

	@IsNotEmpty()
	orderItems: OrderItemDto[]

	// @IsOptional()
	// sellerId?: number
}
