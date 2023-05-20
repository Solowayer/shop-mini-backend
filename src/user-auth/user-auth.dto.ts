import {
	IsString,
	IsNotEmpty,
	IsEmail,
	IsOptional,
	IsMobilePhone,
	MinLength,
	MaxLength,
	Matches
} from 'class-validator'

export class RegisterUserDto {
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

export class LoginUserDto {
	@IsNotEmpty({ message: 'Is required' })
	@Matches(/^(380\d{9}|[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3})$/, {
		message: 'Invalid email or phone number format'
	})
	emailOrPhoneNumber: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 characters' })
	password: string
}
