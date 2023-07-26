import { Module, forwardRef } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { ProductModule } from 'src/product/product.module'

@Module({
	imports: [forwardRef(() => ProductModule)],
	controllers: [CartController],
	providers: [CartService],
	exports: [CartService]
})
export class CartModule {}
