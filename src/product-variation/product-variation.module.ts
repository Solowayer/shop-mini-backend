import { Module } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { ProductVariationController } from './product-variation.controller';

@Module({
  controllers: [ProductVariationController],
  providers: [ProductVariationService]
})
export class ProductVariationModule {}
