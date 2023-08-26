import { Controller, Post, Body, Patch, Param, Delete, Get, ParseIntPipe } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartItemDto, UpdateCartItemDto } from './dto'
import { Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'
import { GetUserId } from 'lib/decorators/userId.decorator'

@Controller('cart')
@Roles(Role.USER, Role.SELLER, Role.ADMIN)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get('')
	findAllCartItems(@GetUserId() userId: number) {
		return this.cartService.findAllCartItems(userId)
	}

	@Post('create')
	createCartItem(@GetUserId() userId: number, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.createCartItem(userId, createCartItemDto)
	}

	@Patch('update/:cartItemId')
	updateCartItem(
		@GetUserId() userId: number,
		@Param('cartItemId') cartItemId: string,
		@Body() updateCartItemDto: UpdateCartItemDto
	) {
		return this.cartService.updateCartItem(userId, +cartItemId, updateCartItemDto)
	}

	@Delete('delete/:cartItemId')
	deleteCartItem(@GetUserId() userId: number, @Param('cartItemId') cartItemId: number) {
		return this.cartService.deleteCartItem(userId, +cartItemId)
	}

	@Delete('delete-all')
	deleteAllCartItems(@GetUserId() userId: number) {
		return this.cartService.deleteAllCartItems(userId)
	}

	@Get('check/:productId')
	async checkProductInCart(@GetUserId() userId: number, @Param('productId', ParseIntPipe) productId: number) {
		return this.cartService.checkProductInCart(userId, productId)
	}
}
