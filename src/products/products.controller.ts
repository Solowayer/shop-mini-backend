import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	createProduct(@Body() createProductDto: CreateProductDto) {
		return this.productsService.createProduct(createProductDto)
	}

	@Get()
	findAllProducts() {
		return this.productsService.findAllProducts()
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.productsService.findProductById(+id)
	}

	@Get(':slug')
	findBySlug(@Param('slug') slug: string) {
		return this.productsService.findProductBySlug(slug)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productsService.updateProduct(+id, updateProductDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productsService.removeProduct(+id)
	}
}
