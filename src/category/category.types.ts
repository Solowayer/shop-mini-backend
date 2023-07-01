import { Prisma } from '@prisma/client'

export type CategoryWithChildren = Prisma.CategoryGetPayload<{
	include: { children: true }
}>

export type CategoryWithParents = Prisma.CategoryGetPayload<{
	include: { parents: true; children: true }
}>

export type CategorySelect = Prisma.CategorySelectScalar
