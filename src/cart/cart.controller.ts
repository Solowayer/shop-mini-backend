import { Controller, Post, Body, Patch, Param, Delete, Get, ForbiddenException } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Role, User } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'

@Controller('cart')
@Roles(Role.USER, Role.SELLER)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get('')
	get(@GetUser() user: User) {
		if (!user) throw new ForbiddenException('User is not authorized')
		return this.cartService.getCart(user.id)
	}

	@Delete('delete')
	delete(@GetUser() user: User) {
		return this.cartService.deleteCart(user.id)
	}

	@Post('add')
	addCartItem(@GetUser() user: User, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.addCartItem(user.id, createCartItemDto)
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
