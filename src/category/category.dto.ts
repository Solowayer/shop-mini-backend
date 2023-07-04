import { PartialType } from '@nestjs/mapped-types'
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
	@IsNotEmpty()
	@IsString()
	slug: string

	@IsNotEmpty()
	@IsString()
	name: string

	@IsOptional()
	@IsNumber()
	parentId?: number

	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	childrenIds?: number[]
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
