import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.createCategory(createCategoryDto)
	}

	@Get()
	findAllCategories() {
		return this.categoryService.findAllCategories()
	}

	@Get(':id')
	findCategoryById(@Param('id') id: string) {
		return this.categoryService.findCategoryById(+id)
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
