import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateSellerDto, UpdateSellerDto } from './dto'
import { Prisma, Seller } from '@prisma/client'
import { UserService } from 'src/user/user.service'

@Injectable()
export class SellerService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	async findAllSellers(): Promise<Seller[]> {
		return await this.prisma.seller.findMany({ include: { products: true } })
	}

	async findOneSeller(where: Prisma.SellerWhereUniqueInput): Promise<Seller> {
		return await this.prisma.seller.findUnique({ where })
	}

	async findSellerById(sellerId: number): Promise<Seller> {
		const seller = await this.findOneSeller({ id: sellerId })

		if (!seller) throw new NotFoundException('Seller not found')

		return seller
	}

	async findUserSeller(userId: number): Promise<Seller> {
		const seller = await this.findOneSeller({ userId })
		if (!seller) throw new NotFoundException('Seller not found')
		return seller
	}

	async createSeller(createSellerDto: CreateSellerDto, userId: number): Promise<Seller> {
		const { name, adress, description, email, phoneNumber, pib } = createSellerDto

		const existingSeller = await this.prisma.seller.findFirst({
			where: {
				OR: [{ email }, { phoneNumber }]
			}
		})

		if (existingSeller) throw new BadRequestException('This email or phone number is already exist')

		const user = await this.userService.findUserById(userId)
		if (user.role !== 'ADMIN') {
			await this.userService.updateUser(userId, { role: 'SELLER' })
		}

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
		const seller = await this.findOneSeller({ userId })

		if (!seller) return false

		return true
	}
}
