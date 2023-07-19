import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ListService } from './list.service'
import { CreateListDto, UpdateListDto } from './list.dto'
import { GetUserId } from 'src/common/decorators/userId.decorator'
import { Role } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'

@Controller('list')
@Roles(Role.USER, Role.SELLER)
export class ListController {
	constructor(private readonly listService: ListService) {}

	@Post('create')
	create(@GetUserId() userId: number, @Body() createListDto: CreateListDto) {
		return this.listService.createList(userId, createListDto)
	}

	@Get(':id')
	getOne(@GetUserId() userId: number, @Param('id') id: string) {
		return this.listService.getOneList(userId, +id)
	}

	@Get()
	findAll() {
		return this.listService.findAll()
	}

	@Patch('edit/:id')
	update(@GetUserId() userId: number, @Param('id') id: string, @Body() updateListDto: UpdateListDto) {
		return this.listService.updateList(userId, +id, updateListDto)
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.listService.removeList(+id)
	}
}
