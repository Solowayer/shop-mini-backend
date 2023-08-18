import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductVariationDto } from './dto/create-product-variation.dto'
import { UpdateProductVariationDto } from './dto/update-product-variation.dto'
import { Prisma, ProductVariation } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { ProductService } from 'src/product/product.service'
import * as fs from 'fs'

@Injectable()
export class ProductVariationService {
	constructor(private prisma: PrismaService, private productService: ProductService) {}

	async findOne(where: Prisma.ProductVariationWhereUniqueInput): Promise<ProductVariation> {
		const variation = await this.prisma.productVariation.findUnique({
			where
		})
		return variation
	}

	async findById(id: number): Promise<ProductVariation> {
		const variation = await this.findOne({ id })
		if (!variation) throw new NotFoundException('Product variation not found')
		return variation
	}

	async findByProductId(productId: number): Promise<ProductVariation[]> {
		return await this.prisma.productVariation.findMany({ where: { productId } })
	}

	async create(createProductVariationDto: CreateProductVariationDto) {
		const { attributes, productId, ...rest } = createProductVariationDto

		const product = await this.productService.findOne({ id: productId })
		if (!product) throw new NotFoundException(`Product not found`)

		const variation = await this.prisma.productVariation.create({
			data: {
				...rest,
				product: { connect: { id: productId } },
				attributeValues: {
					create: attributes.map(attr => ({
						value: attr.value,
						attribute: { connect: { id: attr.attributeId } }
					}))
				}
			}
		})

		return variation
	}

	async update(id: number, updateProductVariationDto: UpdateProductVariationDto): Promise<ProductVariation> {
		const { attributes } = updateProductVariationDto

		await this.prisma.attributeValue.deleteMany({ where: { productVariationId: id } })

		const updatedProductVariation = await this.prisma.productVariation.update({
			where: { id },
			data: {
				...updateProductVariationDto,
				attributeValues: {
					create: attributes.map(attr => ({
						value: attr.value,
						attribute: { connect: { id: attr.attributeId } }
					}))
				}
			}
		})

		return updatedProductVariation
	}

	async delete(id: number) {
		const variation = await this.prisma.productVariation.findUnique({ where: { id } })
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

		const deletedProductVariation = await this.prisma.productVariation.delete({ where: { id } })

		return deletedProductVariation
	}
}
