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
		const category = await this.getOneCategory({ id }, { children: true })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async getCategoryBySlug(slug: string): Promise<CategoryFullType> {
		const category = await this.getOneCategory({ slug })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const { name, slug, parentId, childrenIds } = createCategoryDto

		const existingSlug = await this.getOneCategory({ slug })
		const existingName = await this.getOneCategory({ name })
		if (existingSlug || existingName) throw new BadRequestException('This category already exists')

		const children = childrenIds ? childrenIds.map(childrenId => ({ id: childrenId })) : []

		const category = await this.prisma.category.create({
			data: {
				name,
				slug,
				parentId,
				children: { connect: children }
			},
			include: {
				parent: true,
				children: true
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

		const childrens = childrenIds ? childrenIds.map(childrenId => ({ id: childrenId })) : []

		const updatedCategory = await this.prisma.category.update({
			where,
			data: {
				parentId,
				children: { connect: childrens },
				...updateCategoryDto
			},
			include: { parent: true, children: true }
		})

		return updatedCategory
	}

	async removeCategory(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
		const category = await this.getOneCategory(where)
		if (!category) throw new NotFoundException('Category not found')

		return this.prisma.category.delete({ where })
	}

	async getCategoryTree(id: number): Promise<CategoryFullType[]> {
		const category = await this.getOneCategory({ id })
		if (!category) throw new NotFoundException('Category not found')

		const children = await this.prisma.category.findMany({
			where: { parentId: category.id },
			include: { children: true }
		})

		const nestedCategories = await Promise.all(children.map(child => this.getCategoryTree(child.id)))
		const flattenedCategories = nestedCategories.flat()

		const categoryTree = [category, ...flattenedCategories]

		return categoryTree
	}

	async getCategoryBreadcrumbs(id: number): Promise<CategoryFullType[]> {
		const breadcrumbs: CategoryFullType[] = []

		let categoryId = id
		while (categoryId) {
			const category = await this.getOneCategory({ id: categoryId })
			if (!category) throw new NotFoundException('Category not found')

			breadcrumbs.unshift(category)
			categoryId = category.parentId
		}

		return breadcrumbs
	}
}
