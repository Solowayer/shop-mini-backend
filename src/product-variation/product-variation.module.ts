import { Module } from '@nestjs/common'
import { ProductVariationService } from './product-variation.service'
import { ProductVariationController } from './product-variation.controller'
import { ProductModule } from 'src/product/product.module'

@Module({
	imports: [ProductModule],
	controllers: [ProductVariationController],
	providers: [ProductVariationService]
})
export class ProductVariationModule {}
