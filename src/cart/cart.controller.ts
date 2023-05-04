import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartDto, UpdateCartDto } from './cart.dto'
import { JwtUserGuard } from 'src/common/guards/jwt.guard'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@UseGuards(JwtUserGuard)
	@Post()
	createCart(@GetUser() user: User, @Body() createCartDto: CreateCartDto) {
		return this.cartService.createCart(user.id, createCartDto)
	}

	@Patch(':id')
	updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
		return this.cartService.updateCart(+id, updateCartDto)
	}

	@Delete(':id')
	removeCart(@Param('id') id: string) {
		return this.cartService.removeCart(+id)
	}
}
