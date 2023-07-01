import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('')
	getAllCategories() {
		return this.categoryService.getAllCategories()
	}

	@Get('main')
	getMainCategories() {
		return this.categoryService.getMainCategories()
	}

	@Get('c/:id')
	getCategoryById(@Param('id') id: string) {
		return this.categoryService.getOneCategory({ id: +id })
	}

	@Get(':slug')
	getCategoryBySlug(@Param('slug') slug: string) {
		return this.categoryService.getOneCategory({ slug })
	}

	@Post()
	createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.createCategory(createCategoryDto)
	}

	@Patch('c/:id')
	updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoryService.updateCategory({ id: +id }, updateCategoryDto)
	}

	@Delete('c/:id')
	removeCategory(@Param('id') id: string) {
		return this.categoryService.removeCategory({ id: +id })
	}
}
