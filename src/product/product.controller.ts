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

	@UseGuards()
	@Post('create')
	create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
		return this.productService.createProduct(createProductDto, user.id)
	}

	@Get('c/:categoryId')
	getByCategoryId(@Param('categoryId') categoryId: string) {
		return this.productService.getProductsByCategoryId(+categoryId)
	}

	@Get('c/tree/:categoryId')
	getByCategoryTree(@Param('categoryId') categoryId: string) {
		return this.productService.getProductsByCategoryTree(+categoryId)
	}

	@Get('seller')
	getBySeller(@GetUser() user: User) {
		return this.productService.getProductsBySeller(user.id)
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
		return this.productService.updateProduct({ id: +id }, updateProductDto)
	}

	@Delete('p/:id')
	remove(@Param('id') id: string) {
		return this.productService.removeProduct({ id: +id })
	}
}
