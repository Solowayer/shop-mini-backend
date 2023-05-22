import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from 'prisma/prisma.service'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as passport from 'passport'
import * as pgSession from 'connect-pg-simple'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	app.setGlobalPrefix('api')

	const pgStore = pgSession(session)
	const pgSessionStore = new pgStore({
		conString: config.get('DATABASE_URL'),
		tableName: 'Session',
		pruneSessionInterval: 60 * 15 * 1000
	})

	app.use(cookieParser())

	app.use(
		session({
			secret: config.get('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				// maxAge: 60 * 60 * 24 * 1 * 1000,
				maxAge: 60 * 15 * 1000
			},
			store: pgSessionStore
		})
	)

	app.use(passport.initialize())
	app.use(passport.session())

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	app.enableCors({ origin: 'http://localhost:3000', credentials: true })

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	await app.listen(4200)
}
bootstrap()
