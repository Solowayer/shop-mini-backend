import { Type } from 'class-transformer'
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum ProductsSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest',
	RATING = 'rating'
}

export class FindAllProductsDto extends PaginationDto {
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
