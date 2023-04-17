import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, UpdateProductDto } from './dto'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	createProduct(@Body() createProductDto: CreateProductDto) {
		return this.productService.createProduct(createProductDto)
	}

	@Get()
	findAllProducts() {
		return this.productService.findAllProducts()
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.productService.findProductById(+id)
	}

	@Get(':slug')
	findBySlug(@Param('slug') slug: string) {
		return this.productService.findProductBySlug(slug)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productService.updateProduct(+id, updateProductDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productService.removeProduct(+id)
	}
}
