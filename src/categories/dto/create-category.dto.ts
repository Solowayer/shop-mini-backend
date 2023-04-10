import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCategoryDto {
	@IsNotEmpty()
	name: string

	@IsOptional()
	parentId?: number

	@IsOptional()
	subCategories?: CreateCategoryDto[]
	id: any
}
