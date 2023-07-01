import { PartialType } from '@nestjs/mapped-types'
import { Prisma } from '@prisma/client'
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
import { PaginationDto } from 'src/pagination/pagination.dto'

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
	NEWEST = 'newest',
	OLDEST = 'oldest',
	RATING = 'rating'
}

export class GetAllProductsDto extends PaginationDto {
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
