import { Module } from '@nestjs/common'
import { SellerAuthService } from './seller-auth.service'
import { SellerAuthController } from './seller-auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './seller-auth.strategy'

@Module({
	imports: [JwtModule.register({})],
	controllers: [SellerAuthController],
	providers: [SellerAuthService, JwtStrategy]
})
export class SellerAuthModule {}
