import { ConflictException, Injectable } from '@nestjs/common'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { Attribute, AttributeValue } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'

@Injectable()
export class AttributeService {
	constructor(private prisma: PrismaService) {}

	async findAll() {
		return await this.prisma.attribute.findMany({ include: { values: true } })
	}

	async findOne(id: number) {
		return await this.prisma.attribute.findUnique({
			where: { id },
			include: { values: true }
		})
	}

	async findValues(attributeId: number) {
		return await this.prisma.attributeValue.findMany({
			where: { attributeId }
		})
	}

	async findByCategoryId(categoryId: number): Promise<Attribute[]> {
		const categoryAttributes = await this.prisma.attributeToCategory.findMany({
			where: { categoryId }
		})

		const attributeIds = categoryAttributes.map(attr => attr.attributeId)

		const attributes = await this.prisma.attribute.findMany({
			where: { id: { in: attributeIds } },
			include: { values: true }
		})

		return attributes
	}

	async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
		const { name } = createAttributeDto

		const attr = await this.prisma.attribute.create({
			data: {
				name
			},
			include: { values: true }
		})

		return attr
	}

	async createValue(createValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
		const { value, attributeId, productVariationId } = createValueDto

		const existingAttrValue = await this.prisma.attributeValue.findUnique({
			where: {
				attributeId_productVariationId: { attributeId, productVariationId }
			}
		})

		if (existingAttrValue) {
			throw new ConflictException(`Product variation already have value for this attribute`)
		}

		return await this.prisma.attributeValue.create({
			data: {
				value,
				attribute: {
					connect: { id: attributeId }
				},
				productVariation: {
					connect: { id: productVariationId }
				}
			}
		})
	}

	update(id: number, updateAttributeDto: UpdateAttributeDto) {
		return `This action updates a #${id} attribute`
	}

	remove(id: number) {
		return `This action removes a #${id} attribute`
	}
}
