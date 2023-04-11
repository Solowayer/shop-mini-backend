import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category } from '@prisma/client'

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const { name, parentId, subCategories } = createCategoryDto

		const existingCategory = await this.prisma.category.findUnique({ where: { name } })
		if (existingCategory) throw new BadRequestException('Категорія з такою назвою вже існує')

		const category = await this.prisma.category.create({
			data: {
				name,
				parent: parentId ? { connect: { id: parentId } } : undefined
			}
		})

		if (subCategories && subCategories.length > 0) {
			await this.createSubcategories(subCategories, category.id)
		}

		return category
	}

	private async createSubcategories(subCategories: CreateCategoryDto[], parentId: number) {
		for (const subCategoryDto of subCategories) {
			const { name, subCategories } = subCategoryDto
			const subCategory = await this.prisma.category.create({
				data: {
					name,
					parent: { connect: { id: parentId } }
				}
			})

			if (subCategories && subCategories.length > 0) {
				await this.createSubcategories(subCategoryDto.subCategories, subCategory.id)
			}
		}
	}

	async findAllCategories() {
		return await this.prisma.category.findMany()
	}

	async findCategoryById(id: number) {
		return await this.prisma.category.findUnique({ where: { id }, include: { subCategories: true } })
	}

	async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
		const { name } = updateCategoryDto

		const category = await this.prisma.category.findUnique({ where: { id } })
		if (!category) throw new NotFoundException('Категорія не знайдена')

		const updatedCategory = await this.prisma.category.update({ where: { id }, data: { name } })

		return updatedCategory
	}

	removeCategory(id: number) {
		return this.prisma.category.delete({ where: { id } })
	}
}
