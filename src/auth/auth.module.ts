import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { LocalStrategy } from 'src/common/strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { SessionSerializer } from './session.serializer'
import { UserService } from 'src/user/user.service'

@Module({
	imports: [PassportModule.register({ session: true })],
	controllers: [AuthController],
	providers: [AuthService, UserService, LocalStrategy, SessionSerializer]
})
export class AuthModule {}
