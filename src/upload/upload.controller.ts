import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@Controller('upload')
export class UploadController {
	// constructor(private readonly uploadService: UploadService) {}

	@Post()
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, callback) => {
					const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
					const filename = `${file.fieldname}-${uniqueSuffix}`
					callback(null, filename)
				}
			})
		})
	)
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file)
		return { message: 'Файл завантажено успішно' }
	}
}
