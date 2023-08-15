import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreateCartItemDto {
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	quantity: number

	@IsNumber()
	@IsNotEmpty()
	productVariationId: number
}
