import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Prisma } from '@prisma/client'
import { CategoryFullType } from 'src/common/types/full-model.types'
import { categoryObject } from 'src/common/return-objects'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAllCategories(): Promise<Category[]> {
		const categories = await this.prisma.category.findMany()
		if (!categories) throw new NotFoundException('Categories not found')
		return categories
	}

	async getMainCategories(): Promise<Category[]> {
		return await this.prisma.category.findMany({ where: { parentId: null } })
	}

	async getOneCategory(
		uniqueArgs: Prisma.CategoryWhereUniqueInput,
		selectCategory?: Prisma.CategorySelect
	): Promise<CategoryFullType> {
		const category = await this.prisma.category.findUnique({
			where: uniqueArgs,
			select: { ...categoryObject, ...selectCategory }
		})

		return category
	}

	async getCategoryById(id: number): Promise<CategoryFullType> {
		const category = await this.getOneCategory({ id })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async getCategoryBySlug(slug: string): Promise<CategoryFullType> {
		const category = await this.getOneCategory({ slug })
		if (!category) throw new NotFoundException('Category not found')

		return category
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

	async updateCategory(
		where: Prisma.CategoryWhereUniqueInput,
		updateCategoryDto: UpdateCategoryDto
	): Promise<Category> {
		const { parentId, childrenIds } = updateCategoryDto

		const category = await this.getOneCategory(where)
		if (!category) throw new NotFoundException('Category not found')

		const parents = await this.getParentCategories(parentId)
		const childrens = childrenIds ? childrenIds.map(childrenId => ({ id: childrenId })) : []

		const updatedCategory = await this.prisma.category.update({
			where,
			data: {
				parents: { connect: parents.map(parent => ({ id: parent.id })) },
				children: { connect: childrens },
				...updateCategoryDto
			},
			include: { parents: true }
		})

		return updatedCategory
	}

	async removeCategory(where: Prisma.CategoryWhereUniqueInput) {
		const category = await this.getOneCategory(where)
		if (!category) throw new NotFoundException('Category not found')

		return this.prisma.category.delete({ where })
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
