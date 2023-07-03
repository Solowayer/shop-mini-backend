import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { PaginationService } from 'src/pagination/pagination.service'
import { CategoryService } from 'src/category/category.service'
import { UserService } from 'src/user/user.service'
import { SellerService } from 'src/seller/seller.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PaginationService, CategoryService, SellerService]
})
export class ProductModule {}
