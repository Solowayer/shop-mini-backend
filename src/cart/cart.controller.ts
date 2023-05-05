import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartDto, CreateCartItemDto, UpdateCartDto } from './cart.dto'
import { JwtUserGuard } from 'src/common/guards/jwt.guard'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@UseGuards(JwtUserGuard)
	@Post()
	addCartItem(@GetUser() user: User, @Body() createCartItemDto: CreateCartItemDto) {
		return this.cartService.addCartItem(user.id, createCartItemDto)
	}
}
