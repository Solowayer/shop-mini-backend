import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsOptional,
	IsMobilePhone,
	MinLength,
	MaxLength,
	ValidateIf
} from 'class-validator'

export class SignupSellerDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	adress: string

	@IsString()
	@IsOptional()
	@MaxLength(300, { message: 'Shouldn`t have more than 300 symbols' })
	description?: string

	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsMobilePhone('uk-UA')
	phoneNumber: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 symbols' })
	password: string

	@IsString()
	@IsNotEmpty()
	pib: string
}

export class SigninSellerDto {
	@ValidateIf(o => o.phoneNumber === undefined)
	@IsEmail()
	email: string

	@ValidateIf(o => o.email === undefined)
	@IsMobilePhone('uk-UA')
	phoneNumber: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 characters' })
	password: string
}
