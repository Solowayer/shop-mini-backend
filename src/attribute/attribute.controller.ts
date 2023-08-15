import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { AttributeService } from './attribute.service'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'

@Controller('attributes')
export class AttributeController {
	constructor(private readonly attributeService: AttributeService) {}

	@Get()
	findAll() {
		return this.attributeService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.attributeService.findOne(+id)
	}

	@Get('values/:id')
	findValues(@Param('id') id: string) {
		return this.attributeService.findValues(+id)
	}

	@Get('category/:categoryId')
	findByCategoryId(@Param('categoryId') categoryId: string) {
		return this.attributeService.findByCategoryId(+categoryId)
	}

	@Post('create')
	create(@Body() createAttributeDto: CreateAttributeDto) {
		return this.attributeService.create(createAttributeDto)
	}

	@Post('create-value')
	createValue(@Body() createValueDto: CreateAttributeValueDto) {
		return this.attributeService.createValue(createValueDto)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
		return this.attributeService.update(+id, updateAttributeDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.attributeService.remove(+id)
	}
}
