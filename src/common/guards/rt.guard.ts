import { AuthGuard } from '@nestjs/passport'

export class RtGuard extends AuthGuard('refresh') {
	constructor() {
		super()
	}
}
