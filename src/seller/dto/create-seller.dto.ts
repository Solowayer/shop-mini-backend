import { IsString, IsOptional, MaxLength, IsNotEmpty, IsEmail, IsMobilePhone } from 'class-validator'

export class CreateSellerDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	adress: string

	@IsString()
	@IsOptional()
	@MaxLength(1000)
	description?: string

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsOptional()
	@IsMobilePhone('uk-UA')
	phoneNumber: string

	@IsString()
	@IsNotEmpty()
	pib: string
}
