import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, FindAllProductsDto, UpdateProductDto } from './dto'
import { Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'
import { GetUserId } from 'lib/decorators/userId.decorator'

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

	@Get('l/:wishlistId')
	findByList(@Param('wishlistId') wishlistId: string, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findProductsByList(findAllProductsDto, +wishlistId)
	}

	// ?
	@Roles(Role.SELLER)
	@Get('seller')
	findSellerProducts(@GetUserId() userId: number, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findSellerProducts(userId, findAllProductsDto)
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
	create(@Body() createProductDto: CreateProductDto, @GetUserId() userId: number) {
		return this.productService.createProduct(createProductDto, userId)
	}

	@Roles(Role.SELLER)
	@Post('create-many')
	createMany(@Body() createProductDtos: CreateProductDto[], @GetUserId() userId: number) {
		return this.productService.createManyProducts(createProductDtos, userId)
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
