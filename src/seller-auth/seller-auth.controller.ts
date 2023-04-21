import { Body, Controller, Post } from '@nestjs/common'
import { SellerAuthService } from './seller-auth.service'
import { SignupSellerDto } from './seller-auth.dto'

@Controller('seller-auth')
export class SellerAuthController {
	constructor(private readonly sellerService: SellerAuthService) {}

	@Post('signup')
	signupSeller(@Body() signupSellerDto: SignupSellerDto) {
		return this.sellerService.signupSeller(signupSellerDto)
	}

	@Post('signin')
	signinSeller(@Body() signinSellerDto: SignupSellerDto) {
		return this.sellerService.signinSeller(signinSellerDto)
	}
}
