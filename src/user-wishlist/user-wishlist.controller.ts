import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UserWishlistService } from './user-wishlist.service'
import { CreateWishlistDto, UpdateWishlistDto } from './dto'
import { GetUserId } from 'lib/decorators/userId.decorator'
import { Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Controller('lists')
@Roles(Role.USER, Role.SELLER, Role.ADMIN)
export class UserWishlistController {
	constructor(private readonly userWishlistService: UserWishlistService) {}

	@Get()
	findAllWishlists(@GetUserId() userId: number) {
		return this.userWishlistService.findAllWishlists(userId)
	}

	@Get(':id')
	findWishlistById(@GetUserId() userId: number, @Param('id') id: string) {
		console.log('userId:', userId)

		return this.userWishlistService.findWishlistById(userId, +id)
	}

	@Post('create')
	createWishlist(@GetUserId() userId: number, @Body() createWishlistDto: CreateWishlistDto) {
		return this.userWishlistService.createWishlist(userId, createWishlistDto)
	}

	@Patch('update/:id')
	updateWishlist(@GetUserId() userId: number, @Param('id') id: string, @Body() updateWishlistDto: UpdateWishlistDto) {
		return this.userWishlistService.updateWishlist(userId, +id, updateWishlistDto)
	}

	@Delete('delete/:id')
	deleteWishlist(@GetUserId() userId: number, @Param('id') id: string) {
		return this.userWishlistService.deleteWishlist(userId, +id)
	}

	@Post(':listId/product/:productId')
	addProductToWishlist(
		@GetUserId() userId: number,
		@Param('listId') listId: string,
		@Param('productId') productId: string
	) {
		return this.userWishlistService.addProductToWishlist(userId, +listId, +productId)
	}

	@Delete('product/:productId')
	deleteProductFromWishlist(@GetUserId() userId: number, @Param('productId') productId: string) {
		return this.userWishlistService.deleteProductFromWishlist(userId, +productId)
	}

	@Get('check/:productId')
	checkProductInList(@GetUserId() userId: number, @Param('productId') productId: string) {
		return this.userWishlistService.checkProductInWishlist(userId, +productId)
	}
}
