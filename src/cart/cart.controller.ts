import { Controller, Post, Body, Patch, Param, Delete, Get, UseGuards, ForbiddenException } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartItemDto, UpdateCartItemDto } from './cart.dto'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Public } from 'src/common/decorators/public.decorator'
import { User } from '@prisma/client'
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Public()
	@Get('')
	get(@GetUser() user: User) {
		if (!user) throw new ForbiddenException('User is not authorized')
		return this.cartService.getCart(user.id)
	}

	@UseGuards(AuthenticatedGuard)
	@Delete('delete')
	delete(@GetUser() user: User) {
		return this.cartService.deleteCart(user.id)
	}

	@UseGuards(AuthenticatedGuard)
	@Post('add')
	addCartItem(@GetUser() user: User, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.addCartItem(user.id, createCartItemDto)
	}

	@UseGuards(AuthenticatedGuard)
	@Patch(':cartItemId')
	updateCartItem(@Param('cartItemId') cartItemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
		return this.cartService.updateCartItem(cartItemId, updateCartItemDto)
	}

	@UseGuards(AuthenticatedGuard)
	@Delete(':cartItemId')
	deleteCartItem(@Param('cartItemId') cartItemId: number) {
		return this.cartService.deleteCartItem(+cartItemId)
	}
}
