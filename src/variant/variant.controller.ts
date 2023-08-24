import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { VariantService } from './variant.service'
import { CreateVariantDto } from './dto/create-variant.dto'
import { UpdateVariantDto } from './dto/update-variant.dto'

@Controller('variants')
export class VariantController {
	constructor(private readonly variantService: VariantService) {}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.variantService.findById(+id)
	}

	@Post('create')
	create(@Body() createVariantDto: CreateVariantDto) {
		return this.variantService.create(createVariantDto)
	}

	@Post('create-many')
	createMany(@Body() createVariantDtos: CreateVariantDto[]) {
		return this.variantService.createMany(createVariantDtos)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
		return this.variantService.update(+id, updateVariantDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.variantService.delete(+id)
	}
}
