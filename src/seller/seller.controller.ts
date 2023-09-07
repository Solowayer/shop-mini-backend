import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { SellerService } from './seller.service'
import { CreateSellerDto, UpdateSellerDto } from './dto'
import { GetUser } from 'lib/decorators/user.decorator'
import { Role, User } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Controller('seller')
export class SellerController {
	constructor(private readonly sellerService: SellerService) {}

	@Get()
	findAllSellers() {
		return this.sellerService.findAllSellers()
	}

	@Get('s/:sellerId')
	findSellerById(@Param('sellerId') sellerId: string) {
		return this.sellerService.findSellerById(+sellerId)
	}

	@Roles(Role.SELLER, Role.ADMIN)
	@Get('my-seller')
	findUserSeller(@GetUser() user: User) {
		return this.sellerService.findUserSeller(user.id)
	}

	@Roles(Role.USER, Role.ADMIN)
	@Post('register')
	createSeller(@Body() createSellerDto: CreateSellerDto, @GetUser() user: User) {
		return this.sellerService.createSeller(createSellerDto, user.id)
	}

	@Roles(Role.SELLER, Role.ADMIN)
	@Patch(':sellerId')
	updateSeller(@Param('sellerId') sellerId: number, @Body() updateSellerDto: UpdateSellerDto) {
		return this.sellerService.updateSeller({ id: sellerId }, updateSellerDto)
	}

	@Get('check-seller')
	checkSeller(@GetUser() user: User) {
		return this.sellerService.checkSeller(user.id)
	}
}
