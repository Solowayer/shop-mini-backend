import { CartItem, Category, List, Prisma, Product, Seller, User } from '@prisma/client'

type ObjectWithBooleanValues<T> = {
	[K in keyof T]: boolean
}

type CategoryObjectType = ObjectWithBooleanValues<Category>
type ProductObjectType = ObjectWithBooleanValues<Product>
type CartItemObjectType = ObjectWithBooleanValues<CartItem>
type SellerObjectType = ObjectWithBooleanValues<Seller>
type UserObjectType = ObjectWithBooleanValues<User>
type ListObjectType = ObjectWithBooleanValues<List>

export const categoryObject: Prisma.CategorySelectScalar = {
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

export const cartItemObject: CartItemObjectType = {
	id: true,
	name: true,
	createdAt: true,
	updatedAt: true,
	price: true,
	image: true,
	quantity: true,
	productId: true,
	userId: true
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

export const userObject: UserObjectType = {
	id: true,
	createdAt: true,
	updatedAt: true,
	email: true,
	phoneNumber: true,
	passwordHash: true,
	role: true
}

export const listObject: ListObjectType = {
	id: true,
	name: true,
	createdAt: true,
	updatedAt: true,
	userId: true
}
