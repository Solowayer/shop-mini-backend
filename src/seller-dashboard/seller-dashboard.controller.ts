import { Controller, Get, Body, Patch, Param, Post, UseGuards } from '@nestjs/common'
import { SellerDashboardService } from './seller-dashboard.service'
import { UpdateSellerDto } from './seller-dashboard.dto'
import { JwtSellerGuard } from 'src/seller-auth/seller-auth.guard'
import { GetSeller } from 'src/seller/seller.decorator'
import { Seller } from '@prisma/client'

@Controller('dashboard')
export class SellerDashboardController {
	constructor(private readonly sellerDashboardService: SellerDashboardService) {}

	@UseGuards(JwtSellerGuard)
	@Get('info')
	getInfo(@GetSeller() seller: Seller) {
		return this.sellerDashboardService.getInfo(seller)
	}

	@UseGuards(JwtSellerGuard)
	@Patch('edit')
	update(@GetSeller() seller: Seller, @Body() updateSellerDto: UpdateSellerDto) {
		return this.sellerDashboardService.update(seller.id, updateSellerDto)
	}

	@Post('products')
	addSellerProduct() {
		return this.sellerDashboardService.addSellerProduct()
	}
}
