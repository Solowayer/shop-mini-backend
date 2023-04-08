import { IsString, IsOptional, MaxLength, IsNumber, IsNotEmpty } from 'class-validator'

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	@MaxLength(300)
	description: string

	@IsNumber()
	price: number
}
