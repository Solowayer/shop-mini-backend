import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class AuthenticatedGuard extends AuthGuard('local') {
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest()

		return request.isAuthenticated()
	}
}
