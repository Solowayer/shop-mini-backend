import { IsString, IsOptional } from 'class-validator'

export class FindAllCategoriesDto {
	@IsOptional()
	@IsString()
	q?: string
}
