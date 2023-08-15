import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

@Controller('product-variation')
export class ProductVariationController {
  constructor(private readonly productVariationService: ProductVariationService) {}

  @Post()
  create(@Body() createProductVariationDto: CreateProductVariationDto) {
    return this.productVariationService.create(createProductVariationDto);
  }

  @Get()
  findAll() {
    return this.productVariationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductVariationDto: UpdateProductVariationDto) {
    return this.productVariationService.update(+id, updateProductVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariationService.remove(+id);
  }
}
