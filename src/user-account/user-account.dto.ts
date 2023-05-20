import { PartialType } from '@nestjs/mapped-types'
import { RegisterUserDto } from 'src/user-auth/user-auth.dto'

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
