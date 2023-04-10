import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async createCategory(createCategoryDto: CreateCategoryDto) {
		const { name, parentId, subCategories } = createCategoryDto

		const existingCategory = await this.prisma.category.findUnique({ where: { name } })
		if (existingCategory) throw new BadRequestException('Категорія з такою назвою вже існує')

		// create category
		const category = await this.prisma.category.create({ data: { name, parentId } })

		// create sub-categories
		if (subCategories && subCategories.length > 0) {
			await Promise.all(subCategories.map(subCategory => this.createSubCategory(subCategory, category.id)))
		}

		return category
	}

	private async createSubCategory(subCategoryDto: CreateCategoryDto, parentId: number) {
		const { name, subCategories } = subCategoryDto

		// create sub-category
		const subCategory = await this.prisma.category.create({ data: { name, parentId } })

		// create sub-categories recursively
		if (subCategories && subCategories.length > 0) {
			for (const subCategoryDto of subCategories) {
				await this.createSubCategory(subCategoryDto, subCategory.id)
			}
		}
	}

	async findAllCategories() {
		return await this.prisma.category.findMany()
	}

	async findCategoryById(id: number) {
		return await this.prisma.category.findUnique({ where: { id } })
	}

	async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
		const { subCategories, ...data } = updateCategoryDto

		if (subCategories && subCategories.length > 0) {
			for (const subCategoryDto of subCategories) {
				if (subCategoryDto.id) {
					await this.prisma.category.update({
						where: { id: subCategoryDto.id },
						data: { name: subCategoryDto.name, parentId: id }
					})
				} else {
					const subCategory = await this.prisma.category.create({
						data: {
							name: subCategoryDto.name,
							parentId: id
						}
					})
					await this.createSubCategory(subCategoryDto, subCategory.id)
				}
			}
		}

		return this.prisma.category.update({ where: { id }, data })
	}

	removeCategory(id: number) {
		return this.prisma.category.delete({ where: { id } })
	}
}
