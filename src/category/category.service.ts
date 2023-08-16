import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Prisma } from '@prisma/client'
import { CategoryFullType } from 'lib/types/full-model.types'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async findAllCategories(): Promise<Category[]> {
		const categories = await this.prisma.category.findMany({ include: { attributes: true } })
		if (!categories) throw new NotFoundException('Categories not found')
		return categories
	}

	async findMainCategories(): Promise<Category[]> {
		return await this.prisma.category.findMany({ where: { parentId: null } })
	}

	async findOneCategory(
		uniqueArgs: Prisma.CategoryWhereUniqueInput,
		select?: Prisma.CategorySelect
	): Promise<CategoryFullType> {
		const defaultCategorySelect: Prisma.CategorySelectScalar = {
			id: true,
			slug: true,
			name: true,
			parentId: true
		}

		const category = await this.prisma.category.findUnique({
			where: uniqueArgs,
			select: { ...defaultCategorySelect, ...select }
		})

		return category
	}

	async findCategoryById(id: number): Promise<CategoryFullType> {
		const category = await this.findOneCategory({ id }, { children: true })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async findCategoryBySlug(slug: string): Promise<CategoryFullType> {
		const category = await this.findOneCategory({ slug }, { children: true })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async findCategoryTree(id: number): Promise<CategoryFullType[]> {
		const category = await this.findOneCategory({ id })
		if (!category) throw new NotFoundException('Category not found')

		const children = await this.prisma.category.findMany({
			where: { parentId: category.id },
			include: { children: true }
		})

		const nestedCategories = await Promise.all(children.map(child => this.findCategoryTree(child.id)))
		const flattenedCategories = nestedCategories.flat()

		const categoryTree = [category, ...flattenedCategories]

		return categoryTree
	}

	async findCategoryBreadcrumbs(id: number): Promise<CategoryFullType[]> {
		const breadcrumbs: CategoryFullType[] = []

		let categoryId = id
		while (categoryId) {
			const category = await this.findOneCategory({ id: categoryId })
			if (!category) throw new NotFoundException('Category not found')

			breadcrumbs.unshift(category)
			categoryId = category.parentId
		}

		return breadcrumbs
	}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
		const { name, slug, parentId, childrenIds } = createCategoryDto

		const existingSlug = await this.findOneCategory({ slug })
		if (existingSlug) throw new BadRequestException('This category already exists')

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

		const category = await this.findOneCategory(where)
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

	async deleteCategory(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
		const category = await this.findOneCategory(where)
		if (!category) throw new NotFoundException('Category not found')

		return this.prisma.category.delete({ where })
	}
}
