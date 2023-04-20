import { Controller, Get } from '@nestjs/common'
import { SellerAuthService } from './seller-auth.service'

@Controller('sellers')
export class SellerAuthController {
	constructor(private readonly sellerService: SellerAuthService) {}

	@Get()
	findAllSellers() {
		return this.sellerService.signUpSeller()
	}
}
