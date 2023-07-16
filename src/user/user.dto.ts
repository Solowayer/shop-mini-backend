import { Gender } from '@prisma/client'
import { IsEmail, IsEnum, IsMobilePhone, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email?: string

	@IsMobilePhone('uk-UA')
	phoneNumber?: string

	@IsString()
	@MinLength(6, { message: 'The password must contain at least 6 characters' })
	@MaxLength(20, { message: 'Password shouldn`t have more than 20 symbols' })
	password?: string
}

export class UpdateProfileDto {
	@IsString()
	firstName?: string

	@IsString()
	lastName?: string

	@IsEnum(Gender)
	gender?: Gender
}
