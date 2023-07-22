import { Body, Controller, ForbiddenException, Get, Param, Patch, Post } from '@nestjs/common'
import { SellerService } from './seller.service'
import { CreateSellerDto, UpdateSellerDto } from './dto'
import { GetUser } from 'lib/decorators/user.decorator'
import { Role, User } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Controller('seller')
export class SellerController {
	constructor(private readonly sellerService: SellerService) {}

	@Get()
	getAll() {
		return this.sellerService.getAllSellers()
	}

	@Get('s/:sellerId')
	getById(@Param('sellerId') sellerId: string) {
		return this.sellerService.getSellerById(+sellerId)
	}

	@Roles(Role.SELLER)
	@Get('my-seller')
	getByUserId(@GetUser() user: User) {
		return this.sellerService.getSellerByUserId(user.id)
	}

	@Roles(Role.USER)
	@Post('register')
	create(@Body() createSellerDto: CreateSellerDto, @GetUser() user: User) {
		return this.sellerService.createSeller(createSellerDto, user.id)
	}

	@Roles(Role.SELLER)
	@Patch(':sellerId')
	update(@Param('sellerId') sellerId: number, @Body() updateSellerDto: UpdateSellerDto) {
		return this.sellerService.updateSeller({ id: sellerId }, updateSellerDto)
	}

	@Get('check-seller')
	check(@GetUser() user: User) {
		if (!user) throw new ForbiddenException('User is not authorized')
		return this.sellerService.checkSeller(user.id)
	}
}
