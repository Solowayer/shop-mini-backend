import { AuthGuard } from '@nestjs/passport'

export class JwtSellerGuard extends AuthGuard('jwt-seller') {
	constructor() {
		super()
	}
}
