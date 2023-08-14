import { IsNotEmpty, IsString } from 'class-validator'

export class CreateWishlistDto {
	@IsNotEmpty()
	@IsString()
	name: string
}
