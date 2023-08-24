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
	async findAllProducts(@Query() findAllProductsDto: FindAllProductsDto) {
		return await this.productService.findAllProducts(findAllProductsDto)
	}

	@Get('category/:categoryId')
	findProductsByCategoryId(
		@Param('categoryId', ParseIntPipe) categoryId: number,
		@Query() findAllProductsDto: FindAllProductsDto
	) {
		return this.productService.findProductsByCategoryId(findAllProductsDto, categoryId)
	}

	@Get('category/tree/:categoryId')
	findProductsByCategoryTree(@Param('categoryId') categoryId: string, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findProductsByCategoryTree(findAllProductsDto, +categoryId)
	}

	@Get('wishlist/:wishlistId')
	findProductsByWishlistId(@Param('wishlistId') wishlistId: string, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findProductsByWishlistId(findAllProductsDto, +wishlistId)
	}

	@Roles(Role.SELLER)
	@Get('seller')
	findProductsBySellerId(@GetUserId() userId: number, @Query() findAllProductsDto: FindAllProductsDto) {
		return this.productService.findProductsBySellerId(userId, findAllProductsDto)
	}

	@Get('product/:id')
	findProductById(@Param('id') id: string) {
		return this.productService.findProductById(+id)
	}

	@Get(':slug')
	findProductBySlug(@Param('slug') slug: string) {
		return this.productService.findProductBySlug(slug)
	}

	@Roles(Role.SELLER)
	@Post('create')
	createProduct(@Body() createProductDto: CreateProductDto, @GetUserId() userId: number) {
		return this.productService.createProduct(createProductDto, userId)
	}

	@Roles(Role.SELLER)
	@Post('create-many')
	createManyProducts(@Body() createProductDtos: CreateProductDto[], @GetUserId() userId: number) {
		return this.productService.createManyProducts(createProductDtos, userId)
	}

	@Roles(Role.SELLER)
	@Patch('product/:id')
	updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productService.updateProduct(+id, updateProductDto)
	}

	@Roles(Role.SELLER)
	@Delete('product/:id')
	deleteProduct(@Param('id') id: string) {
		return this.productService.deleteProduct(+id)
	}
}
