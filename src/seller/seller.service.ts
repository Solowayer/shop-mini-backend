import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateSellerDto, UpdateSellerDto } from './seller.dto'
import { Prisma, Product } from '@prisma/client'
import { UserService } from 'src/user/user.service'

@Injectable()
export class SellerService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	async findSellerByid(sellerId: number, sellerSelect: Prisma.SellerSelect = {}) {
		return await this.prisma.seller.findUnique({ where: { id: sellerId }, select: { ...sellerSelect } })
	}

	async findAllSellers() {
		return await this.prisma.seller.findMany({ include: { products: true } })
	}

	async createSeller(createSellerDto: CreateSellerDto, userId: number) {
		const { name, adress, description, email, phoneNumber, pib } = createSellerDto

		const existingSeller = await this.prisma.seller.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})

		if (existingSeller) throw new BadRequestException('This email or phone number is already exist')

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

		return newSeller
	}

	async updateSeller(sellerId: number, updateSellerDto: UpdateSellerDto) {
		const updatedSeller = await this.prisma.seller.update({ where: { id: sellerId }, data: updateSellerDto })
		return updatedSeller
	}

	async checkSeller(userId: number): Promise<boolean> {
		const user = await this.userService.getUserById(userId, { seller: true })

		if (user.seller) return true

		return false
	}

	async getSellerProducts(userId: number): Promise<Product[]> {
		const user = await this.userService.getUserById(userId, { seller: true })

		const seller = await this.findSellerByid(user.seller.id, { products: true })

		return seller.products
	}
}
