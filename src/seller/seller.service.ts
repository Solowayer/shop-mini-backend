import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateSellerDto, UpdateSellerDto } from './seller.dto'
import { Prisma, Seller } from '@prisma/client'
import { SellerFullType } from 'src/common/types/full-model.types'
import { sellerObject } from 'src/common/return-objects'
import { UserService } from 'src/user/user.service'

@Injectable()
export class SellerService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

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

		if (!seller) throw new NotFoundException('Seller not found')

		return seller
	}

	async getSellerByUserId(userId: number): Promise<SellerFullType> {
		const seller = await this.getOneSeller({ userId }, { products: true })
		if (!seller) throw new NotFoundException('Seller not found')
		return seller
	}

	async createSeller(createSellerDto: CreateSellerDto, userId: number): Promise<Seller> {
		// if (!userId) throw new BadRequestException('Can/`t/ create a seller')

		const { name, adress, description, email, phoneNumber, pib } = createSellerDto

		const existingSeller = await this.prisma.seller.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})

		if (existingSeller) throw new BadRequestException('This email or phone number is already exist')

		await this.userService.updateUser({ id: userId }, { role: 'SELLER' })
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
		const seller = await this.getOneSeller({ userId })

		if (!seller) return false

		return true
	}
}
