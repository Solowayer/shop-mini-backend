import { IsNotEmpty } from 'class-validator'

export class CreateAttributeDto {
	@IsNotEmpty({ message: 'Name should not be empty' })
	name: string
}
