import { PartialType } from '@nestjs/mapped-types'
import { SignupUserDto } from 'src/user-auth/user-auth.dto'

export class UpdateUserDto extends PartialType(SignupUserDto) {}
