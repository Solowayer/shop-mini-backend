import { Injectable } from '@nestjs/common'
import { PaginationDto } from './pagination.dto'

@Injectable()
export class PaginationService {
	getPagination(paginationDto: PaginationDto, defaultPerPage = 8): { perPage: number; skip: number } {
		const page = paginationDto.page ?? 1
		const perPage = paginationDto.limit ?? defaultPerPage

		const skip = (page - 1) * perPage

		return { perPage, skip }
	}
}
