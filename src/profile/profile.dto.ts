import { Gender } from '@prisma/client'
import { IsString, IsEnum } from 'class-validator'

export class UpdateProfileDto {
	@IsString()
	firstName?: string

	@IsString()
	lastName?: string

	@IsEnum(Gender)
	gender?: Gender
}
