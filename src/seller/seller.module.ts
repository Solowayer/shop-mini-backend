import { Module } from '@nestjs/common'
import { SellerService } from './seller.service'
import { SellerController } from './seller.controller'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [SellerController],
	providers: [SellerService, UserService]
})
export class SellerModule {}
