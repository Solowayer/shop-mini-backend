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

	addSellerProduct() {
		return 'product'
	}
}
