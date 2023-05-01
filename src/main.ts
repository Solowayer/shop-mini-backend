import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from 'prisma/prisma.service'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	app.enableCors()

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	await app.listen(4200)
}
bootstrap()
