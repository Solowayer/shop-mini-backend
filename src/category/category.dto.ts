import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	slug: string

	@IsOptional()
	parentId?: number

	@IsOptional()
	subCategories?: CreateCategoryDto[]
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
