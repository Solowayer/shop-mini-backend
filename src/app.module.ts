import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { SellerModule } from './seller/seller.module'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { CartModule } from './cart/cart.module'
import { UploadModule } from './upload/upload.module'
import { PaginationModule } from './pagination/pagination.module'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './common/guards/roles.guard'
import { ProfileModule } from './profile/profile.module';
import { ListModule } from './list/list.module';
import { ProductsOnListsModule } from './products-on-lists/products-on-lists.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,

		AuthModule,
		UserModule,

		SellerModule,

		ProductModule,
		CategoryModule,
		OrderModule,
		CartModule,
		UploadModule,
		PaginationModule,
		ProfileModule,
		ListModule,
		ProductsOnListsModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})
export class AppModule {}
