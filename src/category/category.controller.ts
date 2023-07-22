import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { Roles } from 'lib/decorators/roles.decorator'
import { Role } from '@prisma/client'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('')
	getAll() {
		return this.categoryService.getAllCategories()
	}

	@Get('main')
	getMain() {
		return this.categoryService.getMainCategories()
	}

	@Get('c/:id')
	getById(@Param('id') id: string) {
		return this.categoryService.getCategoryById(+id)
	}

	@Get(':slug')
	getBySlug(@Param('slug') slug: string) {
		return this.categoryService.getCategoryBySlug(slug)
	}

	@Get('tree/:id')
	getTree(@Param('id') id: string) {
		return this.categoryService.getCategoryTree(+id)
	}

	@Get('breadcrumbs/:id')
	getBreadcrumbs(@Param('id') id: string) {
		return this.categoryService.getCategoryBreadcrumbs(+id)
	}

	// @Roles(Role.ADMIN)
	@Post('create')
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.createCategory(createCategoryDto)
	}

	@Roles(Role.ADMIN)
	@Patch('c/:id')
	update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoryService.updateCategory({ id: +id }, updateCategoryDto)
	}

	@Roles(Role.ADMIN)
	@Delete('c/:id')
	delete(@Param('id') id: string) {
		return this.categoryService.deleteCategory({ id: +id })
	}
}
