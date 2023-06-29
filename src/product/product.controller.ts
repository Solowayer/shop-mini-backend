import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, GetAllProductsDto, UpdateProductDto } from './product.dto'
import { GetUser } from 'src/common/decorators/user.decorator'
import { User } from '@prisma/client'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAllProducts(@Query() getAllProductsDto: GetAllProductsDto) {
		return await this.productService.getAllProducts(getAllProductsDto)
	}

	@Get('max-price')
	async getMaxPrice() {
		return await this.productService.getMaxPrice()
	}

	@UseGuards()
	@Post('create')
	createProduct(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
		return this.productService.createProduct(createProductDto, user.id)
	}

	@Get('c/:categoryId')
	getByCategoryId(@Param('categoryId') categoryId: string) {
		return this.productService.getProductsByCategoryId(+categoryId)
	}

	@Get('p/:id')
	getById(@Param('id') id: string) {
		return this.productService.getProductById(+id)
	}

	@Get(':slug')
	getBySlug(@Param('slug') slug: string) {
		return this.productService.getProductBySlug(slug)
	}

	@Patch('p/:id')
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productService.updateProduct(+id, updateProductDto)
	}

	@Delete('p/:id')
	remove(@Param('id') id: string) {
		return this.productService.removeProduct(+id)
	}
}
