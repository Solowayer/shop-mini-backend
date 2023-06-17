/* eslint-disable no-console */
import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@Controller('upload')
export class UploadController {
	@Post('file')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/files',
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

	@Post('image')
	@UseInterceptors(
		FilesInterceptor('images', 10, {
			storage: diskStorage({
				destination: './uploads/images',
				filename: (req, file, callback) => {
					const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
					const filename = `${file.fieldname}-${uniqueSuffix}`
					callback(null, filename)
				}
			}),
			fileFilter: (req, file, callback) => {
				if (file.mimetype.match(/\/(jpeg|png|gif)$/)) {
					callback(null, true)
				} else {
					callback(new BadRequestException('Invalid file type'), false)
				}
			},
			limits: {
				fileSize: 1000 * 1000 * 2 // 2MB
			}
		})
	)
	uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
		console.log(files)
		return { message: 'Завантажено успішно' }
	}
}
