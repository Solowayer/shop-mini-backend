import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'
import { Roles } from 'lib/decorators/roles.decorator'
import { Role } from '@prisma/client'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('')
	findAll() {
		return this.categoryService.findAllCategories()
	}

	@Get('main')
	findMain() {
		return this.categoryService.findMainCategories()
	}

	@Get('c/:id')
	findById(@Param('id') id: string) {
		return this.categoryService.findCategoryById(+id)
	}

	@Get(':slug')
	findBySlug(@Param('slug') slug: string) {
		return this.categoryService.findCategoryBySlug(slug)
	}

	@Get('tree/:id')
	findTree(@Param('id') id: string) {
		return this.categoryService.findCategoryTree(+id)
	}

	@Get('breadcrumbs/:id')
	findBreadcrumbs(@Param('id') id: string) {
		return this.categoryService.findCategoryBreadcrumbs(+id)
	}

	@Roles(Role.ADMIN)
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
