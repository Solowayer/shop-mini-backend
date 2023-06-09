import { PartialType } from '@nestjs/mapped-types'
import { RegisterUserDto } from 'src/auth/auth.dto'

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
