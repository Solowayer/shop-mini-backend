import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	recipient: string

	@IsString()
	@IsNotEmpty()
	adress: string

	// @IsOptional()
	// sellerId?: number
}
