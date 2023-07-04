import { Category, Product, Seller } from '@prisma/client'

type ObjectWithTrueValues<T> = {
	[K in keyof T]: true
}

type CategoryObjectType = ObjectWithTrueValues<Category>
type ProductObjectType = ObjectWithTrueValues<Product>
type SellerObjectType = ObjectWithTrueValues<Seller>

export const categoryObject: CategoryObjectType = {
	id: true,
	slug: true,
	name: true,
	parentId: true
}

export const productObject: ProductObjectType = {
	id: true,
	slug: true,
	name: true,
	createdAt: true,
	updatedAt: true,
	images: true,
	description: true,
	price: true,
	categoryId: true,
	sellerId: true,
	published: true,
	rating: true
}

export const sellerObject: SellerObjectType = {
	id: true,
	name: true,
	createdAt: true,
	updatedAt: true,
	description: true,
	adress: true,
	email: true,
	phoneNumber: true,
	pib: true,
	userId: true
}
