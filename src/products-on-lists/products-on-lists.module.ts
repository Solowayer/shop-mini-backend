import { Module } from '@nestjs/common';
import { ProductsOnListsService } from './products-on-lists.service';
import { ProductsOnListsController } from './products-on-lists.controller';

@Module({
  controllers: [ProductsOnListsController],
  providers: [ProductsOnListsService]
})
export class ProductsOnListsModule {}
