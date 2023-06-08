import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category } from '@prisma/client'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getMainCategories() {
		return await this.prisma.category.findMany({ where: { isMain: true }, orderBy: { name: 'asc' } })
	}

	async getCategoryById(id: number) {
		return await this.prisma.category.findUnique({
			where: { id },
			include: { parents: true, childrens: true }
		})
	}

	async getCategoryBySlug(slug: string) {
		return await this.prisma.category.findUnique({
			where: { slug },
			include: { parents: true, childrens: true }
		})
	}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const { name, slug, isMain, parentIds, childrenIds } = createCategoryDto

		const existingCategory = await this.prisma.category.findFirst({
			where: {
				OR: [{ slug: slug }, { name: name }]
			}
		})
		if (existingCategory) throw new BadRequestException('This category is already exist')

		if (parentIds && parentIds.length > 0 && childrenIds && childrenIds.length > 0) {
			throw new BadRequestException('The same category cannot be as parent and children')
		}

		const parents = parentIds ? parentIds.map(parentId => ({ id: parentId })) : []
		const childrens = childrenIds ? childrenIds.map(childrenId => ({ id: childrenId })) : []

		const category = await this.prisma.category.create({
			data: {
				name,
				isMain,
				slug,
				parents: { connect: parents },
				childrens: { connect: childrens }
			},
			include: {
				parents: true,
				childrens: true
			}
		})

		return category
	}

	async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
		const { name } = updateCategoryDto

		const category = await this.prisma.category.findUnique({ where: { id } })
		if (!category) throw new NotFoundException('Category not found')

		const updatedCategory = await this.prisma.category.update({ where: { id }, data: { name } })

		return updatedCategory
	}

	removeCategory(id: number) {
		return this.prisma.category.delete({ where: { id } })
	}
}
