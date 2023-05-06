import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Get } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { JwtUserGuard } from 'src/common/guards/jwt.guard'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@UseGuards(JwtUserGuard)
	@Get('')
	getCart(@GetUser() user: User) {
		return this.cartService.getCart(user.id)
	}

	@UseGuards(JwtUserGuard)
	@Delete('')
	removeCart(@GetUser() user: User) {
		return this.cartService.removeCart(user.id)
	}

	@UseGuards(JwtUserGuard)
	@Post('')
	addCartItem(@GetUser() user: User, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.addCartItem(user.id, createCartItemDto)
	}

	@Patch(':cartItemId')
	updateCartItem(@Param('cartItemId') cartItemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
		return this.cartService.updateCartItem(cartItemId, updateCartItemDto)
	}

	@Delete(':cartItemId')
	deleteCartItem(@Param('cartItemId') cartItemId: number) {
		return this.cartService.deleteCartItem(cartItemId)
	}
}
