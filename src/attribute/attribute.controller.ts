import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { AttributeService } from './attribute.service'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'

@Controller('attribute')
export class AttributeController {
	constructor(private readonly attributeService: AttributeService) {}

	@Post('create-attr')
	create(@Body() createAttributeDto: CreateAttributeDto) {
		return this.attributeService.createAttribute(createAttributeDto)
	}

	@Post('create-attr-value')
	createValue(@Body() createAttributeValueDto: CreateAttributeValueDto) {
		return this.attributeService.createAttributeValue(createAttributeValueDto)
	}

	@Get()
	findAll() {
		return this.attributeService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.attributeService.findOne(+id)
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
