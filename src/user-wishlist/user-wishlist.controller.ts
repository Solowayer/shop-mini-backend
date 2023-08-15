import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UserWishlistService } from './user-wishlist.service'
import { CreateWishlistDto, UpdateWishlistDto } from './dto'
import { GetUserId } from 'lib/decorators/userId.decorator'
import { Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Controller('lists')
@Roles(Role.USER, Role.SELLER)
export class UserWishlistController {
	constructor(private readonly userWishlistService: UserWishlistService) {}

	@Get()
	findAll(@GetUserId() userId: number) {
		return this.userWishlistService.findAll(userId)
	}

	@Get(':id')
	findById(@GetUserId() userId: number, @Param('id') id: string) {
		console.log('userId:', userId)

		return this.userWishlistService.findById(userId, +id)
	}

	@Post('create')
	create(@GetUserId() userId: number, @Body() createWishlistDto: CreateWishlistDto) {
		return this.userWishlistService.create(userId, createWishlistDto)
	}

	@Patch('edit/:id')
	update(@GetUserId() userId: number, @Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
		return this.userWishlistService.update(userId, +id, updateWishlistDto)
	}

	@Delete('delete/:id')
	delete(@GetUserId() userId: number, @Param('id') id: string) {
		return this.userWishlistService.delete(userId, +id)
	}

	@Post(':listId/product/:productId')
	addProduct(@GetUserId() userId: number, @Param('listId') listId: string, @Param('productId') productId: string) {
		return this.userWishlistService.addProductToList(userId, +listId, +productId)
	}

	@Delete('product/:productId')
	deleteProduct(@GetUserId() userId: number, @Param('productId') productId: string) {
		return this.userWishlistService.deleteProductFromList(userId, +productId)
	}

	@Get('check/:productId')
	checkProductInList(@GetUserId() userId: number, @Param('productId') productId: string) {
		return this.userWishlistService.isProductInList(userId, +productId)
	}
}
