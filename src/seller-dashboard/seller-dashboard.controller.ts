import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common'
import { SellerDashboardService } from './seller-dashboard.service'
import { UpdateSellerDto } from './seller-dashboard.dto'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Seller } from '@prisma/client'

@Controller('dashboard')
export class SellerDashboardController {
	constructor(private readonly sellerDashboardService: SellerDashboardService) {}

	@UseGuards()
	@Get('info')
	getSellerInfo(@GetUser() seller: Seller) {
		return this.sellerDashboardService.getSellerInfo(seller)
	}

	@UseGuards()
	@Patch('edit')
	update(@GetUser() seller: Seller, @Body() updateSellerDto: UpdateSellerDto) {
		return this.sellerDashboardService.update(seller.id, updateSellerDto)
	}

	@UseGuards()
	@Get('products')
	getSellerProducts(@GetUser() seller: Seller) {
		return this.sellerDashboardService.getSellerProducts(seller)
	}
}
