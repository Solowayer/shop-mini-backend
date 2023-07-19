import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateListDto {
	@IsNotEmpty()
	@IsString()
	name: string
}
export class UpdateListDto extends PartialType(CreateListDto) {}
