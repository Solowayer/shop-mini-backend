import { IsOptional, IsNumber, IsNotEmpty, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator'
import { CreateAttributeValueDto } from './create-attribute-value.dto'

export class CreateVariantDto {
	@IsNumber()
	productId: number

	@IsArray()
	@IsOptional()
	@ArrayMaxSize(10)
	images?: string[]

	@IsNotEmpty()
	@IsNumber()
	price: number

	@IsNotEmpty()
	@IsNumber()
	stock: number

	@IsArray()
	@ArrayMinSize(1)
	attributeValues?: CreateAttributeValueDto[]
}
