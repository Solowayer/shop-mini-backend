import { Gender } from '@prisma/client'
import { IsString, IsEnum, IsOptional } from 'class-validator'

export class UpdateProfileDto {
	@IsString()
	@IsOptional()
	firstName?: string

	@IsString()
	@IsOptional()
	lastName?: string

	@IsEnum(Gender)
	@IsOptional()
	gender?: Gender
}
