import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateListDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsBoolean()
	@IsOptional()
	isDefault?: boolean
}
export class UpdateListDto extends PartialType(CreateListDto) {}
