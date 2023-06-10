import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateSellerDto } from './seller.dto'
import { UpdateSellerDto } from 'src/seller-dashboard/seller-dashboard.dto'

@Injectable()
export class SellerService {
	constructor(private prisma: PrismaService) {}

	async findAllSellers() {
		return await this.prisma.seller.findMany()
	}

	async createSeller(createSellerDto: CreateSellerDto, userId: number) {
		const { name, adress, description, email, phoneNumber, pib } = createSellerDto
		const newSeller = await this.prisma.seller.create({
			data: {
				name,
				adress,
				description,
				email,
				phoneNumber,
				pib,
				user: { connect: { id: userId } }
			}
		})

		const existingSeller = await this.prisma.seller.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})

		if (existingSeller) throw new BadRequestException('This email or phone number is already exist')

		return newSeller
	}

	async updateSeller(sellerId: number, updateSellerDto: UpdateSellerDto) {
		const updatedSeller = await this.prisma.seller.update({ where: { id: sellerId }, data: updateSellerDto })

		return updatedSeller
	}
}
