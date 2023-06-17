import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { UserAccountModule } from './user-account/user-account.module'
import { SellerModule } from './seller/seller.module'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { CartModule } from './cart/cart.module'
import { UploadModule } from './upload/upload.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,

		AuthModule,
		UserAccountModule,
		UserModule,

		SellerModule,

		ProductModule,
		CategoryModule,
		OrderModule,
		CartModule,
		UploadModule
	]
})
export class AppModule {}
