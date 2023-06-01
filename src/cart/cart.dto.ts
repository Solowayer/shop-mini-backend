import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreateCartItemDto {
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	productId: number
}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
