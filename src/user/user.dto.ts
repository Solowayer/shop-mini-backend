import { PartialType } from '@nestjs/mapped-types'
import { Role } from '@prisma/client'
import { RegisterUserDto } from 'src/auth/auth.dto'

export class UpdateUserDto extends PartialType(RegisterUserDto) {
	role: Role
}
