import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import {
	IsString,
	IsOptional,
	MaxLength,
	IsNumber,
	IsNotEmpty,
	IsArray,
	IsBoolean,
	ArrayMaxSize,
	IsEnum
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

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export enum ProductsSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'nesest',
	OLDEST = 'oldest',
	RATING = 'rating'
}

export class GetAllProductsDto {
	@IsOptional()
	@IsEnum(ProductsSort)
	sort?: ProductsSort

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
	searchTerm?: string
}
