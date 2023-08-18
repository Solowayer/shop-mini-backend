import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCartItemDto, UpdateCartItemDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { CartItem, Prisma } from '@prisma/client'
import { ProductService } from 'src/product/product.service'
import { CartItemFullType } from 'lib/types/full-model.types'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService, @Inject(ProductService) private productService: ProductService) {}

	async findAll(userId: number): Promise<{ cartItems: CartItem[]; totalAmount: number; totalQuantity: number }> {
		const cartItems = await this.prisma.cartItem.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } })

		const totalAmount = cartItems.reduce((total, item) => total + item.price, 0)
		const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

		return { cartItems, totalAmount, totalQuantity }
	}

	async findOne(
		where: Prisma.CartItemWhereUniqueInput,
		cartItemSelect: Prisma.CartItemSelect = {}
	): Promise<CartItemFullType> {
		const defaultCartItemSelect: Prisma.CartItemSelectScalar = {
			id: true,
			createdAt: true,
			updatedAt: true,
			name: true,
			price: true,
			quantity: true,
			userId: true,
			variantId: true
		}

		const cartItem = await this.prisma.cartItem.findUnique({
			where: where,
			select: { ...defaultCartItemSelect, ...cartItemSelect }
		})

		return cartItem
	}

	async findById(userId: number, cartItemId: number): Promise<CartItem> {
		const cartItem = this.findOne({ id: cartItemId, userId })
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		return cartItem
	}

	async deleteAll(userId: number) {
		const deletedCartItems = await this.prisma.cartItem.deleteMany({ where: { userId } })
		return deletedCartItems
	}

	async create(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { variantId, quantity } = createCartItemDto

		const productVariation = await this.prisma.variant.findUnique({
			where: { id: variantId },
			include: { product: true }
		})

		const existingCartItem = await this.findOne({
			variantId_userId: { variantId, userId }
		})

		if (existingCartItem) {
			const newQuantity = existingCartItem.quantity + quantity

			const cartItem = await this.prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					price: productVariation.price * newQuantity,
					quantity: newQuantity
				}
			})
			return cartItem
		} else {
			const cartItem = await this.prisma.cartItem.create({
				data: {
					name: productVariation.product.name,
					price: productVariation.price * quantity,
					quantity,
					variant: {
						connect: { id: productVariation.id }
					},
					user: {
						connect: { id: userId }
					}
				}
			})
			return cartItem
		}
	}

	async update(userId: number, cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
		const { quantity } = updateCartItemDto

		const cartItem = await this.findOne({ id: cartItemId, userId }, { variant: true })
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		const price = cartItem.variant.price

		const updatedCartItem = await this.prisma.cartItem.update({
			where: { id: cartItemId, userId },
			data: { quantity, price: price * quantity }
		})

		return updatedCartItem
	}

	async delete(userId: number, cartItemId: number): Promise<CartItem> {
		const cartItem = await this.findOne({ userId, id: cartItemId })
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		const deletedCartItem = await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})

		return deletedCartItem
	}

	async isProductInCart(userId: number, productId: number): Promise<{ isInCart: boolean }> {
		const product = await this.productService.findOne({ id: productId })
		if (!product) {
			throw new NotFoundException('Product not found')
		}

		const productVariations = await this.prisma.variant.findMany({
			where: { productId },
			include: { cartItems: { where: { userId } } }
		})

		const isInCart = productVariations.some(variation => variation.cartItems.length > 0)

		return { isInCart }
	}
}
