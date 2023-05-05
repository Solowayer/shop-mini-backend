import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateCartItemDto {
	@IsNumber()
	@IsNotEmpty()
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	productId: number
}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}

export class CreateCartDto {
	cartItems: CreateCartItemDto[]
}

export class UpdateCartDto extends PartialType(CreateCartDto) {}
