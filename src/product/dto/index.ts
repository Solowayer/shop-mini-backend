import { PartialType } from '@nestjs/mapped-types'
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
	@MaxLength(300)
	description: string

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
