import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsString, IsOptional, MaxLength, IsNumber, IsNotEmpty, IsArray, IsBoolean } from 'class-validator'

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	slug: string

	@IsArray()
	@IsOptional()
	images: string[]

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	@MaxLength(1000)
	description: string

	@IsNotEmpty()
	@IsNumber()
	price: number

	@IsOptional()
	@IsNumber()
	categoryId?: number

	// @IsOptional()
	// @IsNumber()
	// sellerId?: number

	@IsBoolean()
	published: boolean
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductsFilterDto {
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	min_price?: number

	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	max_price?: number

	@IsOptional()
	@IsString()
	search?: string
}

export class ProductsSortDto {
	@IsOptional()
	@IsString()
	sort?: 'price_asc' | 'price_desc' | 'rating'
}
