import { Prisma } from '@prisma/client'

export type SellerFullType = Prisma.SellerGetPayload<{ select: { [K in keyof Prisma.SellerSelect]: true } }>

export type SellerWithProducts = Prisma.SellerGetPayload<{
	include: { products: true }
}>
