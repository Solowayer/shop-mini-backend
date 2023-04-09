import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async createCategory(createCategoryDto: CreateCategoryDto) {
		const { name, parentId, subCategories } = createCategoryDto

		const data = { name, parentId: parentId ?? null }

		// create category
		const category = await this.prisma.category.create({ data })

		// create sub-categories
		if (subCategories?.length) {
			await Promise.all(subCategories.map(subCategory => this.createSubCategory(subCategory, category.id)))
		}

		return category
	}

	private async createSubCategory(subCategoryDto: CreateCategoryDto, parentId: number) {
		const { name, subCategories } = subCategoryDto

		const data = { name, parentId }

		// create sub-category
		const subCategory = await this.prisma.category.create({ data })

		// create sub-categories recursively
		if (subCategories && subCategories.length > 0) {
			for (const subCategoryDto of subCategories) {
				await this.createSubCategory(subCategoryDto, subCategory.id)
			}
		}
	}

	findAll() {
		return `This action returns all categories`
	}

	findOne(id: number) {
		return `This action returns a #${id} category`
	}

	update(id: number, updateCategoryDto: UpdateCategoryDto) {
		return `This action updates a #${id} category`
	}

	remove(id: number) {
		return `This action removes a #${id} category`
	}
}
