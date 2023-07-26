import { Module } from '@nestjs/common'
import { SellerService } from './seller.service'
import { SellerController } from './seller.controller'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [UserModule],
	controllers: [SellerController],
	providers: [SellerService],
	exports: [SellerService]
})
export class SellerModule {}
