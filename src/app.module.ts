import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { UserAuthModule } from './user-auth/user-auth.module'
import { UserModule } from './user/user.module'
import { UserAccountModule } from './user-account/user-account.module'
import { SellerAuthModule } from './seller-auth/seller-auth.module'
import { SellerModule } from './seller/seller.module'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { SellerDashboardModule } from './seller-dashboard/seller-dashboard.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,

		UserModule,
		UserAuthModule,
		UserAccountModule,

		SellerModule,
		SellerAuthModule,

		ProductModule,
		CategoryModule,
		OrderModule,
		SellerDashboardModule
	]
})
export class AppModule {}
