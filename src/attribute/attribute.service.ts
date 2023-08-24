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
		return await this.prisma.attribute.findMany()
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
		const { name, categoryIds } = createAttributeDto

		const attr = await this.prisma.attribute.create({
			data: {
				name,
				categories: {
					create: categoryIds.map(categoryId => ({ categoryId }))
				}
			},
			include: { values: true, categories: true }
		})

		return attr
	}

	async createValue(createValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
		const { value, attributeId, variantId } = createValueDto

		const existingAttrValue = await this.prisma.attributeValue.findUnique({
			where: {
				attributeId_variantId: { attributeId, variantId }
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
				variant: {
					connect: { id: variantId }
				}
			}
		})
	}

	update(id: number, updateAttributeDto: UpdateAttributeDto) {
		return this.prisma.attribute.update({ where: { id }, data: updateAttributeDto })
	}

	remove(id: number) {
		return this.prisma.attribute.delete({ where: { id } })
	}
}
