import { Prisma } from '@prisma/client'

export type UserFullType = Prisma.UserGetPayload<{ select: { [K in keyof Required<Prisma.UserSelect>]: true } }>
