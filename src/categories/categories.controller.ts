import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.createCategory(createCategoryDto)
	}

	@Get()
	findAllCategories() {
		return this.categoriesService.findAllCategories()
	}

	@Get(':id')
	findCategoryById(@Param('id') id: string) {
		return this.categoriesService.findCategoryById(+id)
	}

	@Patch(':id')
	updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
		return this.categoriesService.updateCategory(+id, updateCategoryDto)
	}

	@Delete(':id')
	removeCategory(@Param('id') id: string) {
		return this.categoriesService.removeCategory(+id)
	}
}
