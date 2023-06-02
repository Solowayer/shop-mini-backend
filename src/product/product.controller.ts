import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, ProductsFilterDto, ProductsSortDto, UpdateProductDto } from './product.dto'
import { Seller } from '@prisma/client'
import { GetUser } from 'src/common/decorators/user.decorator'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards()
	@Post('')
	createProduct(@GetUser() seller: Seller, @Body() createProductDto: CreateProductDto) {
		return this.productService.createProduct(createProductDto, seller.id)
	}

	@Get()
	async findAllProducts(
		@Query() productsSortDto: ProductsSortDto,
		@Query('minPrice') minPrice: number,
		@Query('maxPrice') maxPrice: number
	) {
		return await this.productService.findAllProducts(+minPrice, +maxPrice, productsSortDto)
	}

	@Get('p:id')
	findById(@Param('id') id: string) {
		return this.productService.findProductById(+id)
	}

	@Get(':slug')
	findBySlug(@Param('slug') slug: string) {
		return this.productService.findProductBySlug(slug)
	}

	@Patch('p:id')
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productService.updateProduct(+id, updateProductDto)
	}

	@Delete('p:id')
	remove(@Param('id') id: string) {
		return this.productService.removeProduct(+id)
	}
}
