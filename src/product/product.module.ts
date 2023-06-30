import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PaginationService]
})
export class ProductModule {}
