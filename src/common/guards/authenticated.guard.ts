import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AuthenticatedGuard extends AuthGuard('local') {
	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest()

		console.log(request.isAuthenticated())

		return request.isAuthenticated()
	}
}
