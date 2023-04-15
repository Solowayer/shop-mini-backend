import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { UserModule } from './user/user.module'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		UserModule,
		ProductModule,
		CategoryModule,
		AuthModule
	]
})
export class AppModule {}
