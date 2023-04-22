import { AuthGuard } from '@nestjs/passport'

export class JwtSellerGuard extends AuthGuard('jwt-seller') {
	constructor() {
		super()
	}
}

export class JwtUserGuard extends AuthGuard('jwt-user') {
	constructor() {
		super()
	}
}
