import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetSeller = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()
	return request.seller
})
