import { IsOptional, IsNumber, IsNotEmpty, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator'

export class CreateProductVariationDto {
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
	@ArrayMinSize(1) // Мінімум 1 атрибут повинен бути вказаний
	attributes?: Array<{ attributeId: number; value: string }>
}
