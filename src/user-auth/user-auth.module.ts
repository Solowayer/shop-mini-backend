import { Module } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { UserAuthController } from './user-auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '../common/strategies/user-auth.strategy'

@Module({
	imports: [JwtModule.register({})],
	controllers: [UserAuthController],
	providers: [UserAuthService, JwtStrategy]
})
export class UserAuthModule {}
