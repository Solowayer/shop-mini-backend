import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class SellerService {
	constructor(private prisma: PrismaService) {}

	findAllSellers() {
		return this.prisma.seller.findMany({ include: { products: true, orders: true } })
	}
}
