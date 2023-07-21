import { Module } from '@nestjs/common'
import { ListService } from './list.service'
import { ListController } from './list.controller'
import { ProductModule } from 'src/product/product.module'

@Module({
	imports: [ProductModule],
	controllers: [ListController],
	providers: [ListService]
})
export class ListModule {}
