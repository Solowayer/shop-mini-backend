import { Injectable } from '@nestjs/common'
import { UpdateSellerDto } from './seller-dashboard.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Seller } from '@prisma/client'

@Injectable()
export class SellerDashboardService {
	constructor(private prisma: PrismaService) {}

	getSellerInfo(seller: Seller) {
		return seller
	}

	async update(sellerId: number, updateSellerDto: UpdateSellerDto) {
		const seller = await this.prisma.seller.update({
			where: { id: sellerId },
			data: updateSellerDto
		})
		return seller
	}

	async getSellerProducts(seller: Seller) {
		const products = await this.prisma.product.findMany({ where: { seller: { id: seller.id } } })
		return products
	}

	addSellerProduct() {
		return 'product'
	}
}
