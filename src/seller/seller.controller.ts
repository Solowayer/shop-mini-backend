import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { SellerService } from './seller.service'
import { CreateSellerDto, UpdateSellerDto } from './seller.dto'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'
import { AuthenticatedGuard } from 'src/common/guards/local.guard'

@Controller('sellers')
export class SellerController {
	constructor(private readonly sellerService: SellerService) {}

	@Get()
	findAllSellers() {
		return this.sellerService.findAllSellers()
	}

	@UseGuards(AuthenticatedGuard)
	@Post('')
	createSeller(@Body() createSellerDto: CreateSellerDto, @GetUser() user: User) {
		return this.sellerService.createSeller(createSellerDto, user.id)
	}

	@UseGuards(AuthenticatedGuard)
	@Patch(':sellerId')
	updateSeller(@Param('sellerId') sellerId: number, @Body() updateSellerDto: UpdateSellerDto) {
		return this.sellerService.updateSeller(sellerId, updateSellerDto)
	}
}
