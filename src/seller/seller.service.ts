import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateSellerDto, UpdateSellerDto } from './seller.dto'
import { Prisma, Product, Seller } from '@prisma/client'
import { SellerFullType } from './seller.types'
import { sellerObject } from './seller.object'

@Injectable()
export class SellerService {
	constructor(private prisma: PrismaService) {}

	async getAllSellers(): Promise<Seller[]> {
		return await this.prisma.seller.findMany({ include: { products: true } })
	}

	async getOneSeller(
		where: Prisma.SellerWhereUniqueInput,
		selectSeller?: Prisma.SellerSelect
	): Promise<SellerFullType> {
		return await this.prisma.seller.findUnique({ where, select: { ...sellerObject, ...selectSeller } })
	}

	async getSellerById(sellerId: number): Promise<SellerFullType> {
		const seller = await this.getOneSeller({ id: sellerId })

		return seller
	}

	async getSellerByUser(userId: number): Promise<SellerFullType> {
		return await this.getOneSeller({ userId }, { products: true })
	}

	async createSeller(createSellerDto: CreateSellerDto, userId: number): Promise<Seller> {
		if (!userId) throw new BadRequestException('Cant create a seller')

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

	async updateSeller(where: Prisma.SellerWhereUniqueInput, updateSellerDto: UpdateSellerDto): Promise<Seller> {
		const updatedSeller = await this.prisma.seller.update({ where, data: updateSellerDto })
		return updatedSeller
	}

	async checkSeller(userId: number): Promise<boolean> {
		const seller = await this.getSellerByUser(userId)

		if (seller) return true

		return false
	}

	async getSellerProducts(userId: number): Promise<Product[]> {
		const seller = await this.getOneSeller({ userId })

		return seller.products
	}
}
