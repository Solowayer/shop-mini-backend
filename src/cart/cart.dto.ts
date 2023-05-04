import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CartItemDto {
	@IsNumber()
	@IsNotEmpty()
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	cartId: number

	@IsNumber()
	@IsNotEmpty()
	productId: number
}

export class CreateCartDto {
	cartItems: CartItemDto[]
}

export class UpdateCartDto extends PartialType(CreateCartDto) {}
