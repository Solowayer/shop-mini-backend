import { Module } from '@nestjs/common'
import { SellerAuthService } from './seller-auth.service'
import { SellerAuthController } from './seller-auth.controller'

@Module({
	controllers: [SellerAuthController],
	providers: [SellerAuthService]
})
export class SellerAuthModule {}
