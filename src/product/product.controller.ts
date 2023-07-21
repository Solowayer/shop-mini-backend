import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, GetAllProductsDto, UpdateProductDto } from './product.dto'
import { GetUser } from 'src/common/decorators/user.decorator'
import { Role, User } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAll(@Query() getAllProductsDto: GetAllProductsDto) {
		return await this.productService.getAllProducts(getAllProductsDto)
	}

	@Get('c/:categoryId')
	getByCategoryId(@Param('categoryId') categoryId: string, @Query() getAllProductsDto: GetAllProductsDto) {
		return this.productService.getProductsByCategoryId(getAllProductsDto, +categoryId)
	}

	@Get('c/tree/:categoryId')
	getByCategoryTree(@Param('categoryId') categoryId: string, @Query() getAllProductsDto: GetAllProductsDto) {
		return this.productService.getProductsByCategoryTree(getAllProductsDto, +categoryId)
	}

	@Get('l/:listId')
	getByList(@Param('listId') listId: string, @Query() getAllProductsDto: GetAllProductsDto) {
		return this.productService.getProductsByList(getAllProductsDto, +listId)
	}

	// ?
	@Roles(Role.SELLER)
	@Get('seller')
	getSellerProducts(@GetUser() user: User, @Query() getAllProductsDto: GetAllProductsDto) {
		return this.productService.getSellerProducts(user.id, getAllProductsDto)
	}

	@Get('p/:id')
	getById(@Param('id') id: string) {
		return this.productService.getProductById(+id)
	}

	@Get(':slug')
	getBySlug(@Param('slug') slug: string) {
		return this.productService.getProductBySlug(slug)
	}

	@Roles(Role.SELLER)
	@Post('create')
	create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
		return this.productService.createProduct(createProductDto, user.id)
	}

	@Roles(Role.SELLER)
	@Patch('p/:id')
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productService.updateProduct({ id: +id }, updateProductDto)
	}

	@Roles(Role.SELLER)
	@Delete('p/:id')
	delete(@Param('id') id: string) {
		return this.productService.deleteProduct({ id: +id })
	}
}
