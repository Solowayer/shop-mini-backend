import { Module } from '@nestjs/common'
import { VariantService } from './variant.service'
import { VariantController } from './variant.controller'
import { ProductModule } from 'src/product/product.module'

@Module({
	imports: [ProductModule],
	controllers: [VariantController],
	providers: [VariantService]
})
export class VariantModule {}
