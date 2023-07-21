import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { Role } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { GetUserId } from 'src/common/decorators/userId.decorator'

@Controller('cart')
@Roles(Role.USER, Role.SELLER)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get('')
	get(@GetUserId() userId: number) {
		return this.cartService.getCart(userId)
	}

	@Delete('delete')
	delete(@GetUserId() userId: number) {
		return this.cartService.deleteCart(userId)
	}

	@Post('add')
	addCartItem(@GetUserId() userId: number, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.addCartItem(userId, createCartItemDto)
	}

	@Patch(':cartItemId')
	updateCartItem(@Param('cartItemId') cartItemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
		return this.cartService.updateCartItem(cartItemId, updateCartItemDto)
	}

	@Delete(':cartItemId')
	deleteCartItem(@Param('cartItemId') cartItemId: number) {
		return this.cartService.deleteCartItem(+cartItemId)
	}
}
