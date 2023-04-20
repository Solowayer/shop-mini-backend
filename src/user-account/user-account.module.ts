import { Module } from '@nestjs/common'
import { UserAccountService } from './user-account.service'
import { UserAccountController } from './user-account.controller'

@Module({
	controllers: [UserAccountController],
	providers: [UserAccountService]
})
export class UserAccountModule {}
