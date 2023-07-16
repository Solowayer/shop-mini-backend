import { IsString, IsNotEmpty, IsEmail, IsOptional, IsMobilePhone, MinLength, MaxLength } from 'class-validator'

export class RegisterUserDto {
	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsString()
	@IsNotEmpty()
	lastName: string

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsOptional()
	@IsMobilePhone('uk-UA')
	phoneNumber?: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 symbols' })
	password: string
}

export class LoginUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 characters' })
	password: string
}
