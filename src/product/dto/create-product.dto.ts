import {
	IsString,
	IsOptional,
	MaxLength,
	IsNumber,
	IsNotEmpty,
	IsArray,
	ArrayMaxSize,
	ArrayMinSize
} from 'class-validator'

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	slug: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	@MaxLength(1000)
	description?: string

	@IsArray()
	@IsOptional()
	@ArrayMaxSize(20)
	tags: string[]

	@IsNumber()
	@IsNotEmpty()
	categoryId: number

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
	attributeValues?: Array<{ attributeId: number; value: string }>
}
