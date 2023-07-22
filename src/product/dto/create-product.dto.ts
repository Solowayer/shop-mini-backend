import {
	IsString,
	IsOptional,
	MaxLength,
	IsNumber,
	IsNotEmpty,
	IsArray,
	IsBoolean,
	ArrayMaxSize
} from 'class-validator'

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	slug: string

	@IsArray()
	@IsOptional()
	@ArrayMaxSize(10)
	images?: string[]

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	@MaxLength(1000)
	description?: string

	@IsNotEmpty()
	@IsNumber()
	price: number

	@IsNumber()
	@IsNotEmpty()
	categoryId: number

	@IsBoolean()
	published: boolean
}
