import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module'
import { CategoriesModule } from './categories/categories.module'
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UsersModule, ProductsModule, CategoriesModule, AuthModule]
})
export class AppModule {}
