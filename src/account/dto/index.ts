import { PartialType } from '@nestjs/mapped-types'
import { SignupDto } from 'src/auth/dto'

export class UpdateUserDto extends PartialType(SignupDto) {}
