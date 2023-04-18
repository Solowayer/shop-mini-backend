import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { UserModule } from './user/user.module'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'
import { SellerModule } from './seller/seller.module';
import { AccountModule } from './account/account.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		UserModule,
		ProductModule,
		CategoryModule,
		AuthModule,
		SellerModule,
		AccountModule,
		OrderModule,
		OrderItemModule
	]
})
export class AppModule {}
