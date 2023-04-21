import { Injectable } from '@nestjs/common'
import { UpdateSellerDto } from './seller-dashboard.dto'
import { Seller } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class SellerDashboardService {
	constructor(private prisma: PrismaService) {}

	getInfo(seller: Seller) {
		const { name } = seller
		return seller
	}

	async update(userId: number, updateSellerDto: UpdateSellerDto) {
		const seller = await this.prisma.seller.update({
			where: { id: userId },
			data: updateSellerDto
		})
		return seller
	}

	addSellerProduct() {
		return 'product'
	}
}
