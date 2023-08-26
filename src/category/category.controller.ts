import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, FindAllCategoriesDto, UpdateCategoryDto } from './dto'
import { Roles } from 'lib/decorators/roles.decorator'
import { Role } from '@prisma/client'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('main')
	findMainCategories() {
		return this.categoryService.findMainCategories()
	}

	@Get('')
	findAllCategories(@Query() findAllCategoriesDto: FindAllCategoriesDto) {
		return this.categoryService.findAllCategories(findAllCategoriesDto)
	}

	@Get('all/:parentId')
	findCategoriesByParentId(@Param('parentId') id: string) {
		return this.categoryService.findCategoriesByParentId(+id)
	}

	@Get('tree/:id')
	findCategoryTreeById(@Param('id') id: string) {
		return this.categoryService.findCategoryTreeById(+id)
	}

	@Get('category-children/:id')
	findCategoryAndChildrenById(@Param('id') id: string) {
		return this.categoryService.findCategoryAndChildrenById(+id)
	}

	@Get('category/:id')
	findCategoryById(@Param('id') id: string) {
		return this.categoryService.findCategoryById(+id)
	}

	@Get(':slug')
	findCategoryBySlug(@Param('slug') slug: string) {
		return this.categoryService.findCategoryBySlug(slug)
	}

	@Get('breadcrumbs/:id')
	findCategoryBreadcrumbs(@Param('id') id: string) {
		return this.categoryService.findCategoryBreadcrumbs(+id)
	}

	@Roles(Role.ADMIN)
	@Post('create')
	createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.createCategory(createCategoryDto)
	}

	@Roles(Role.ADMIN)
	@Patch(':id')
	updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoryService.updateCategory({ id: +id }, updateCategoryDto)
	}

	@Roles(Role.ADMIN)
	@Delete(':id')
	deleteCategory(@Param('id') id: string) {
		return this.categoryService.deleteCategory({ id: +id })
	}
}
