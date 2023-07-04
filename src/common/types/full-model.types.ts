import { Prisma } from '@prisma/client'

export type CategoryFullType = Prisma.CategoryGetPayload<{ select: { [K in keyof Prisma.CategorySelect]: true } }>

export type ProductFullType = Prisma.ProductGetPayload<{ select: { [K in keyof Prisma.ProductSelect]: true } }>

export type SellerFullType = Prisma.SellerGetPayload<{ select: { [K in keyof Prisma.SellerSelect]: true } }>

export type UserFullType = Prisma.UserGetPayload<{ select: { [K in keyof Prisma.UserSelect]: true } }>
