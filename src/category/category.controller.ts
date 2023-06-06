import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	getParentCategories() {
		return this.categoryService.getParentCategories()
	}

	@Get(':id')
	getCategoryById(@Param('id') id: string) {
		return this.categoryService.getCategoryById(+id)
	}

	@Post()
	createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.createCategory(createCategoryDto)
	}

	@Patch(':id')
	updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoryService.updateCategory(+id, updateCategoryDto)
	}

	@Delete(':id')
	removeCategory(@Param('id') id: string) {
		return this.categoryService.removeCategory(+id)
	}
}
