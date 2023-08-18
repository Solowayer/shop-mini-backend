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
				if (file.mimetype.match(/\/(jpeg|png|gif|webp)$/)) {
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
		const imageUrls = files.map(file => {
			const uploadFolder = 'uploads/images'
			const imagePath = join(uploadFolder, file.filename)
			const imageUrl = imagePath.replace(/\\/g, '/')
			return `http://localhost:4200/${imageUrl}`
		})
		return { message: 'Завантажено успішно', imageUrls }
	}

	@Delete('image/:imageName')
	async deleteImage(@Param('imageName') imageName: string) {
		const imagePath = `uploads/images/${imageName}`

		try {
			await fs.promises.unlink(imagePath)
			return { message: 'Видалено успішно', imageName }
		} catch (err) {
			console.log('Помилка при видаленні зображення', err)
			throw new Error('Помилка при видаленні зображення')
		}
	}
}
