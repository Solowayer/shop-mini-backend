import { PartialType } from '@nestjs/mapped-types'
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
	@IsNotEmpty()
	@IsString()
	slug: string

	@IsNotEmpty()
	@IsString()
	name: string

	@IsBoolean()
	@IsOptional()
	isMain?: boolean

	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	parentIds?: number[]

	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	childrenIds?: number[]
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
