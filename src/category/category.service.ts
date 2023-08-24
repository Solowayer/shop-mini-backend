import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, FindAllCategoriesDto, UpdateCategoryDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { Category, Prisma } from '@prisma/client'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async findMainCategories(): Promise<Category[]> {
		return await this.prisma.category.findMany({ where: { parentId: null }, include: { children: true } })
	}

	async findAllCategories(
		findAllCategoriesDto: FindAllCategoriesDto,
		where: Prisma.CategoryWhereInput = {}
	): Promise<Category[]> {
		const { q } = findAllCategoriesDto

		const categoryFilter: Prisma.CategoryWhereInput = {
			name: { contains: q, mode: 'insensitive' }
		}

		const finalWhere: Prisma.CategoryWhereInput = {
			...where,
			...categoryFilter
		}

		const categories = await this.prisma.category.findMany({
			where: finalWhere,
			include: { parent: true, children: true }
		})
		if (!categories) throw new NotFoundException('Categories not found')
		return categories
	}

	async findCategoriesByParentId(parentId: number): Promise<Category[]> {
		return await this.prisma.category.findMany({ where: { parentId } })
	}

	async findCategoryTreeById(id: number): Promise<Category[]> {
		const category = await this.findOneCategory({ id })
		if (!category) throw new NotFoundException('Category not found')

		const children = await this.prisma.category.findMany({
			where: { parentId: category.id },
			include: { children: true }
		})

		const nestedCategories = await Promise.all(children.map(child => this.findCategoryTreeById(child.id)))
		const flattenedCategories = nestedCategories.flat()

		const categoryFlatTree = [category, ...flattenedCategories]

		return categoryFlatTree
	}

	async findOneCategory(uniqueArgs: Prisma.CategoryWhereUniqueInput): Promise<Category> {
		const category = await this.prisma.category.findUnique({
			where: uniqueArgs,
			include: { children: true }
		})

		return category
	}

	async findCategoryAndChildrenById(id: number): Promise<{ category: Category; children: Category[] }> {
		const category = await this.findOneCategory({ id })
		if (!category) throw new NotFoundException('Category not found')

		const children = await this.prisma.category.findMany({
			where: { parentId: category.id },
			include: { children: true }
		})

		return { category, children }
	}

	async findCategoryById(id: number): Promise<Category> {
		const category = await this.findOneCategory({ id })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async findCategoryBySlug(slug: string): Promise<Category> {
		const category = await this.findOneCategory({ slug })
		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async findCategoryBreadcrumbs(id: number): Promise<Category[]> {
		const breadcrumbs: Category[] = []

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
