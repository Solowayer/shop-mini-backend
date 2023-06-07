import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

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
	parentId?: number

	@IsOptional()
	subCategories?: CreateCategoryDto[]
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
