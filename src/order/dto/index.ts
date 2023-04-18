import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CreateOrderItemDto } from 'src/order-item/dto'

export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	adress: string

	@IsNotEmpty()
	orderItems: CreateOrderItemDto[]

	@IsNumber()
	userId: number

	// @IsOptional()
	// sellerId?: number
}
