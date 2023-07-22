import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ListService } from './list.service'
import { CreateListDto, UpdateListDto } from './dto'
import { GetUserId } from 'lib/decorators/userId.decorator'
import { Role } from '@prisma/client'
import { Roles } from 'lib/decorators/roles.decorator'

@Controller('lists')
@Roles(Role.USER, Role.SELLER)
export class ListController {
	constructor(private readonly listService: ListService) {}

	@Post('create')
	create(@GetUserId() userId: number, @Body() createListDto: CreateListDto) {
		return this.listService.createList(userId, createListDto)
	}

	@Patch('edit/:id')
	update(@GetUserId() userId: number, @Param('id') id: string, @Body() updateListDto: UpdateListDto) {
		return this.listService.updateList(userId, +id, updateListDto)
	}

	@Delete('delete/:id')
	remove(@GetUserId() userId: number, @Param('id') id: string) {
		return this.listService.removeList(userId, +id)
	}

	@Get(':id')
	getById(@GetUserId() userId: number, @Param('id') id: string) {
		console.log('userId:', userId)

		return this.listService.getListById(userId, +id)
	}

	@Get()
	getAll(@GetUserId() userId: number) {
		return this.listService.findAllLists(userId)
	}

	@Post('list/:listId/product/:productId')
	addProduct(@GetUserId() userId: number, @Param('listId') listId: string, @Param('productId') productId: string) {
		return this.listService.addProductToList(userId, +listId, +productId)
	}

	@Delete('list/:listId/product/:productId')
	deleteProduct(@GetUserId() userId: number, @Param('listId') listId: string, @Param('productId') productId: string) {
		return this.listService.deleteProductFromList(userId, +listId, +productId)
	}
}
