import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category } from '@prisma/client'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAllCategories() {
		return await this.prisma.category.findMany({ include: { childrens: true, parents: true } })
	}

	async getMainCategories() {
		return await this.prisma.category.findMany({ where: { isMain: true }, orderBy: { name: 'asc' } })
	}

	async getCategoryById(id: number): Promise<Category> {
		const category = await this.prisma.category.findUnique({
			where: { id },
			include: { childrens: true }
		})

		return category
	}

	async getCategoryBySlug(slug: string) {
		return await this.prisma.category.findUnique({
			where: { slug },
			include: { childrens: true }
		})
	}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const { name, slug, isMain, parentId, childrenIds } = createCategoryDto

		const existingCategory = await this.prisma.category.findFirst({
			where: {
				OR: [{ slug: slug }, { name: name }]
			}
		})
		if (existingCategory) throw new BadRequestException('This category is already exist')

		if (parentId && childrenIds && childrenIds.length > 0) {
			throw new BadRequestException('The same category cannot be as parent and children')
		}

		const parents: Category[] = []

		if (parentId) {
			const parentCategory = await this.prisma.category.findUnique({
				where: { id: parentId },
				include: { parents: true }
			})
			if (parentCategory) {
				parents.push(parentCategory)
				parents.push(...parentCategory.parents)
			}
		}

		const childrens = childrenIds ? childrenIds.map(childrenId => ({ id: childrenId })) : []

		const category = await this.prisma.category.create({
			data: {
				name,
				isMain,
				slug,
				parentId,
				parents: { connect: parents.map(parent => ({ id: parent.id })) },
				childrens: { connect: childrens }
			},
			include: {
				childrens: true,
				parents: true
			}
		})

		return category
	}

	async getAllParentCategories(categoryId: number): Promise<Category[]> {
		const category = await this.prisma.category.findUnique({ where: { id: categoryId } })

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		const parents: Category[] = []

		if (category.parentId) {
			const parentCategory = await this.getAllParentCategories(category.parentId)
			parents.push(...parentCategory)
		}

		return parents
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
