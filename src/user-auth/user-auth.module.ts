import { Module } from '@nestjs/common'
import { UserAuthService } from './user-auth.service'
import { UserAuthController } from './user-auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '../common/strategies/user-auth.strategy'
import { RtStrategy } from 'src/common/strategies/rt.strategy'

@Module({
	imports: [JwtModule.register({})],
	controllers: [UserAuthController],
	providers: [UserAuthService, JwtStrategy, RtStrategy]
})
export class UserAuthModule {}
