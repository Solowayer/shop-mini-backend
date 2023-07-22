import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator'

export class LoginUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 characters' })
	password: string
}
