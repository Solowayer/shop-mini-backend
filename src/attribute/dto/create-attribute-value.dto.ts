import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateAttributeValueDto {
	@IsNotEmpty({ message: 'Name should not be empty' })
	value: string

	@IsNumber()
	attributeId: number

	@IsNumber()
	variantId: number
}
