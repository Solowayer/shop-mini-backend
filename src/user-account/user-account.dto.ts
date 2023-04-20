import { PartialType } from '@nestjs/mapped-types'
import { SignupDto } from 'src/user-auth/user-auth.dto'

export class UpdateUserDto extends PartialType(SignupDto) {}
