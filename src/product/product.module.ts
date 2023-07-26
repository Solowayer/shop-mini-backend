import { Module, forwardRef } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { PaginationModule } from 'src/pagination/pagination.module'
import { SellerModule } from 'src/seller/seller.module'
import { CategoryModule } from 'src/category/category.module'
import { UserModule } from 'src/user/user.module'
import { CartModule } from 'src/cart/cart.module'

@Module({
	imports: [PaginationModule, CategoryModule, SellerModule, UserModule, forwardRef(() => CartModule)],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService]
})
export class ProductModule {}
