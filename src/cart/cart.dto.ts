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
