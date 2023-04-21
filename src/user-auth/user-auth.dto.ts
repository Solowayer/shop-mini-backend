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

export class SignupUserDto {
	@IsString()
	@IsNotEmpty()
	username: string

	@IsEmail()
	email: string

	@IsOptional()
	@IsMobilePhone('uk-UA')
	phoneNumber?: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 symbols' })
	password: string
}

export class SigninUserDto {
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