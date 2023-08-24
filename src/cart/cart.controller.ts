import { Controller, Post, Body, Patch, Param, Delete, Get, ParseIntPipe } from '@nestjs/common'
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
	getAll(@GetUserId() userId: number) {
		return this.cartService.findAllCartItems(userId)
	}

	@Post('add')
	create(@GetUserId() userId: number, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.createCartItem(userId, createCartItemDto)
	}

	@Patch(':cartItemId')
	update(
		@GetUserId() userId: number,
		@Param('cartItemId') cartItemId: string,
		@Body() updateCartItemDto: UpdateCartItemDto
	) {
		return this.cartService.updateCartItem(userId, +cartItemId, updateCartItemDto)
	}

	@Delete(':cartItemId')
	delete(@GetUserId() userId: number, @Param('cartItemId') cartItemId: number) {
		return this.cartService.deleteCartItem(userId, +cartItemId)
	}

	@Delete('')
	deleteAll(@GetUserId() userId: number) {
		return this.cartService.deleteAllCartItems(userId)
	}

	@Get('check/:productId')
	async checkProductInCart(@GetUserId() userId: number, @Param('productId', ParseIntPipe) productId: number) {
		return this.cartService.isProductInCart(userId, productId)
	}
}
