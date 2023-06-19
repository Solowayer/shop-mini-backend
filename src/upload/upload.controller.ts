/* eslint-disable no-console */
import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	UploadedFiles,
	BadRequestException,
	Delete,
	Param
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import * as fs from 'fs'

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
		FilesInterceptor('image', 10, {
			storage: diskStorage({
				destination: './uploads/images',
				filename: (req, file, callback) => {
					const ext = extname(file.originalname)
					const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
					const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
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
		// Формування масиву посилань на завантажені зображення
		const imageUrls = files.map(file => {
			// Шлях до папки з зображеннями
			const uploadFolder = 'uploads/images'
			// Повний шлях до зображення
			const imagePath = join(uploadFolder, file.filename)
			// Replace backslashes with forward slashes in the path
			const imageUrl = imagePath.replace(/\\/g, '/')
			// Повернення посилання на зображення
			return `http://localhost:4200/${imageUrl}`
		})
		// console.log(files)
		return { message: 'Завантажено успішно', imageUrls }
	}

	@Delete(':imageName')
	deleteImage(@Param('imageName') imageName: string) {
		const imagePath = `uploads/images/${imageName}`

		fs.unlink(imagePath, err => {
			if (err) {
				console.log('Помилка при видаленні зображення', err)
				throw new Error('Помилка при видаленні зображення')
			}
			console.log('Зображення успішно видалено')
		})
	}
}
