import { ConflictException, Injectable } from '@nestjs/common'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Attribute, AttributeValue } from '@prisma/client'
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'

@Injectable()
export class AttributeService {
	constructor(private prisma: PrismaService) {}

	findAll() {
		return `This action returns all attribute`
	}

	findOne(id: number) {
		return `This action returns a #${id} attribute`
	}

	async createAttribute(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
		const { name } = createAttributeDto

		const existingAttr = await this.prisma.attribute.findUnique({ where: { name } })
		if (existingAttr) throw new ConflictException('Attribute with this name is already exists')

		const attr = await this.prisma.attribute.create({
			data: {
				name
			},
			include: { values: true }
		})

		return attr
	}

	async createAttributeValue(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
		const { value, attributeId, productId } = createAttributeValueDto

		return this.prisma.attributeValue.create({
			data: {
				value,
				attribute: {
					connect: { id: attributeId }
				},
				product: {
					connect: { id: productId }
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
