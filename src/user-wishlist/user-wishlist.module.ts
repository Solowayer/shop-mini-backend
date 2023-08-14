import { Module } from '@nestjs/common'
import { UserWishlistService } from './user-wishlist.service'
import { UserWishlistController } from './user-wishlist.controller'
import { ProductModule } from 'src/product/product.module'

@Module({
	imports: [ProductModule],
	controllers: [UserWishlistController],
	providers: [UserWishlistService]
})
export class UserWishlistModule {}
