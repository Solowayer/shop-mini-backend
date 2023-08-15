import { PartialType, PickType } from '@nestjs/mapped-types'
import { CreateProductDto } from './create-product.dto'

export class UpdateProductDto extends PartialType(PickType(CreateProductDto, ['name', 'description', 'tags'])) {}
