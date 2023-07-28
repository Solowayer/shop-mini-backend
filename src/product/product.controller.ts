import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, FindAllProductsDto, UpdateProductDto } from './dto'
import { GetUser } from 'lib/decorators/user.decorator'
import { Role, User } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async findAll(@Query() findAllProductsDto: FindAllProductsDto) {
		return await this.productService.findAllProducts(findAllProductsDto)
	}

	@Get('c/:categoryId')
	findByCategoryId(
		@Param('categoryId', ParseIntPipe) categoryId: number,
		@Query() findAllProductsDto: FindAllProductsDto
	) {
		return this.productService.findProductsByCategoryId(findAllProductsDto, categoryId)
	}

	@Get('c/tree/:categoryId')
	findByCategoryTree(@Param('categoryId') categoryId: string, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findProductsByCategoryTree(findAllProductsDto, +categoryId)
	}

	@Get('l/:listId')
	findByList(@Param('listId') listId: string, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findProductsByList(findAllProductsDto, +listId)
	}

	// ?
	@Roles(Role.SELLER)
	@Get('seller')
	findSellerProducts(@GetUser() user: User, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findSellerProducts(user.id, findAllProductsDto)
	}

	@Get('p/:id')
	findById(@Param('id') id: string) {
		return this.productService.findProductById(+id)
	}

	@Get(':slug')
	findBySlug(@Param('slug') slug: string) {
		return this.productService.findProductBySlug(slug)
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
