import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const GetUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest()
	if (!request.user) {
		throw new UnauthorizedException('User is not authorized')
	}
	return request.user
})
