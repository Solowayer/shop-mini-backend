import {
	IsString,
	IsOptional,
	MaxLength,
	IsNumber,
	IsNotEmpty,
	IsArray,
	ArrayMaxSize,
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
}
