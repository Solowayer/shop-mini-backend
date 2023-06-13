import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { LocalStrategy } from 'src/common/strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { SessionSerializer } from './session.serializer'

@Module({
	imports: [PassportModule.register({ session: true })],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, SessionSerializer]
})
export class AuthModule {}
