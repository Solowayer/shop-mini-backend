import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ListService } from './list.service'
import { CreateListDto, UpdateListDto } from './list.dto'
import { GetUserId } from 'src/common/decorators/userId.decorator'

@Controller('list')
export class ListController {
	constructor(private readonly listService: ListService) {}

	@Post('create')
	create(@GetUserId() userId: number, @Body() createListDto: CreateListDto) {
		return this.listService.createList(userId, createListDto)
	}

	@Get()
	findAll() {
		return this.listService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.listService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
		return this.listService.update(+id, updateListDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.listService.remove(+id)
	}
}
