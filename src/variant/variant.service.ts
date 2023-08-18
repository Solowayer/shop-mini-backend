import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateVariantDto } from './dto/create-variant.dto'
import { UpdateVariantDto } from './dto/update-variant.dto'
import { Prisma, Variant } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { ProductService } from 'src/product/product.service'
import * as fs from 'fs'

@Injectable()
export class VariantService {
	constructor(private prisma: PrismaService, private productService: ProductService) {}

	async findOne(where: Prisma.VariantWhereUniqueInput): Promise<Variant> {
		const variation = await this.prisma.variant.findUnique({
			where
		})
		return variation
	}

	async findById(id: number): Promise<Variant> {
		const variation = await this.findOne({ id })
		if (!variation) throw new NotFoundException('Product variation not found')
		return variation
	}

	async findByProductId(productId: number): Promise<Variant[]> {
		return await this.prisma.variant.findMany({ where: { productId } })
	}

	async create(createVariantDto: CreateVariantDto) {
		const { attributeValues, productId, ...rest } = createVariantDto

		const product = await this.productService.findOne({ id: productId })
		if (!product) throw new NotFoundException(`Product not found`)

		const variation = await this.prisma.variant.create({
			data: {
				...rest,
				product: { connect: { id: productId } },
				attributeValues: {
					create: attributeValues.map(attr => ({
						value: attr.value,
						attribute: { connect: { id: attr.attributeId } }
					}))
				}
			}
		})

		return variation
	}

	async update(id: number, updateVariantDto: UpdateVariantDto): Promise<Variant> {
		const { attributeValues, ...rest } = updateVariantDto

		await this.prisma.attributeValue.deleteMany({ where: { variantId: id } })

		const updatedProductVariation = await this.prisma.variant.update({
			where: { id },
			data: {
				...rest,
				attributeValues: {
					create: attributeValues.map(attr => ({
						value: attr.value,
						attribute: { connect: { id: attr.attributeId } }
					}))
				}
			}
		})

		return updatedProductVariation
	}

	async delete(id: number) {
		const variation = await this.prisma.variant.findUnique({ where: { id } })
		const variationImages = variation.images

		if (variationImages) {
			for (const imageUrl of variationImages) {
				const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

				const imagePath = `uploads/images/${imageName}`
				try {
					await fs.promises.unlink(imagePath)
					console.log(`Видалено файл: ${imageUrl}`)
				} catch (error) {
					console.log(`Помилка при видаленні файлу: ${imageUrl}`, error)
				}
			}
		}

		const deletedProductVariation = await this.prisma.variant.delete({ where: { id } })

		return deletedProductVariation
	}
}
