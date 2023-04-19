import { PartialType } from '@nestjs/mapped-types'
import { SignupDto } from 'src/auth/auth.dto'

export class UpdateUserDto extends PartialType(SignupDto) {}
