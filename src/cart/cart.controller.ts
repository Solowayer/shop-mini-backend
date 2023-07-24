import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartItemDto, UpdateCartItemDto } from './dto'
import { Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'
import { GetUserId } from 'lib/decorators/userId.decorator'

@Controller('cart')
@Roles(Role.USER, Role.SELLER)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get('')
	getAllItems(@GetUserId() userId: number) {
		return this.cartService.getAllCartItems(userId)
	}

	@Get('p/:productId')
	getItemByProductId(@GetUserId() userId: number, @Param('productId') productId: string) {
		return this.cartService.getCartItemByProductId(userId, +productId)
	}

	@Delete('')
	deleteItems(@GetUserId() userId: number) {
		return this.cartService.deleteAllCartItems(userId)
	}

	@Post('add')
	addItem(@GetUserId() userId: number, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.addCartItem(userId, createCartItemDto)
	}

	@Patch(':cartItemId')
	updateItem(
		@GetUserId() userId: number,
		@Param('cartItemId') cartItemId: string,
		@Body() updateCartItemDto: UpdateCartItemDto
	) {
		return this.cartService.updateCartItem(userId, +cartItemId, updateCartItemDto)
	}

	@Delete(':cartItemId')
	deleteItem(@GetUserId() userId: number, @Param('cartItemId') cartItemId: number) {
		return this.cartService.deleteCartItem(userId, +cartItemId)
	}
}
