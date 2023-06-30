import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category } from '@prisma/client'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAllCategories(): Promise<Category[]> {
		return await this.prisma.category.findMany({ include: { children: true, parents: true } })
	}

	async getMainCategories(): Promise<Category[]> {
		return await this.prisma.category.findMany({ where: { isMain: true }, orderBy: { name: 'asc' } })
	}

	async getCategoryById(id: number): Promise<Category> {
		const category = await this.prisma.category.findUnique({
			where: { id },
			include: { children: true }
		})

		return category
	}

	async getCategoryBySlug(slug: string) {
		return await this.prisma.category.findUnique({
			where: { slug },
			include: { children: true }
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

		const parents = await this.getParentCategories(parentId)

		const childrens = childrenIds ? childrenIds.map(childrenId => ({ id: childrenId })) : []

		const category = await this.prisma.category.create({
			data: {
				name,
				isMain,
				slug,
				parentId,
				parents: { connect: parents.map(parent => ({ id: parent.id })) },
				children: { connect: childrens }
			},
			include: {
				children: true,
				parents: true
			}
		})

		return category
	}

	async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
		const { parentId } = updateCategoryDto
		const category = await this.prisma.category.findUnique({ where: { id } })
		if (!category) throw new NotFoundException('Category not found')

		const parents = await this.getParentCategories(parentId)

		const updatedCategory = await this.prisma.category.update({
			where: { id },
			data: { parents: { connect: parents.map(parent => ({ id: parent.id })) }, ...updateCategoryDto },
			include: { parents: true }
		})

		return updatedCategory
	}

	removeCategory(id: number) {
		return this.prisma.category.delete({ where: { id } })
	}

	private async getParentCategories(parentId: number): Promise<Category[]> {
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

		return parents
	}
}
