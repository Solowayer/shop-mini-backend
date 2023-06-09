import { Module } from '@nestjs/common'
import { UserAuthService } from './auth.service'
import { UserAuthController } from './auth.controller'
import { LocalStrategy } from 'src/common/strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { SessionSerializer } from './session.serializer'

@Module({
	imports: [PassportModule.register({ session: true })],
	controllers: [UserAuthController],
	providers: [UserAuthService, LocalStrategy, SessionSerializer]
})
export class UserAuthModule {}
