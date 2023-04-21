import { PartialType } from '@nestjs/mapped-types'
import { SignupSellerDto } from 'src/seller-auth/seller-auth.dto'

export class UpdateSellerDto extends PartialType(SignupSellerDto) {}
