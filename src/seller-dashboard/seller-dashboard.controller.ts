import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common'
import { SellerDashboardService } from './seller-dashboard.service'
import { UpdateSellerDto } from './seller-dashboard.dto'
import { JwtSellerGuard } from 'src/common/guards'
import { GetUser } from 'src/common/decorators'
import { Seller } from '@prisma/client'

@Controller('dashboard')
export class SellerDashboardController {
	constructor(private readonly sellerDashboardService: SellerDashboardService) {}

	@UseGuards(JwtSellerGuard)
	@Get('info')
	getSellerInfo(@GetUser() seller: Seller) {
		return this.sellerDashboardService.getSellerInfo(seller)
	}

	@UseGuards(JwtSellerGuard)
	@Patch('edit')
	update(@GetUser() seller: Seller, @Body() updateSellerDto: UpdateSellerDto) {
		return this.sellerDashboardService.update(seller.id, updateSellerDto)
	}

	@UseGuards(JwtSellerGuard)
	@Get('products')
	getSellerProducts(@GetUser() seller: Seller) {
		return this.sellerDashboardService.getSellerProducts(seller)
	}
}
