import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from 'prisma/prisma.service'
import { ValidationPipe } from '@nestjs/common'
import * as session from 'express-session'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import * as passport from 'passport'
import { Pool } from 'pg'
import * as pgSession from 'connect-pg-simple'

// "postgresql://postgres:1994@localhost:5432/rozetka-mini-db?schema=public"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)

	const pgPool = new Pool({
		user: 'postgres',
		password: '1994',
		host: 'localhost',
		port: 5432,
		database: 'rozetka-mini-db'
	})

	const pgStore = pgSession(session)
	const sessionStore = new pgStore({ pool: pgPool, tableName: 'Session' })

	app.use(cookieParser())

	app.use(
		session({
			secret: configService.get('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 60 * 60 * 24 * 1 * 1000
			},
			store: sessionStore
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
