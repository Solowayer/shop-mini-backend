import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { Seller } from '@prisma/client'
import { GetUser } from 'src/common/decorators'
import { JwtSellerGuard, JwtUserGuard } from 'src/common/guards'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(JwtSellerGuard || JwtUserGuard)
	@Post()
	createProduct(@GetUser() seller: Seller, @Body() createProductDto: CreateProductDto) {
		return this.productService.createProduct(createProductDto, seller.id)
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
