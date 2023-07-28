import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCartItemDto, UpdateCartItemDto } from './dto'
import { PrismaService } from 'prisma/prisma.service'
import { CartItem, Prisma } from '@prisma/client'
import { ProductService } from 'src/product/product.service'
import { CartItemFullType } from 'lib/types/full-model.types'

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService, @Inject(ProductService) private productService: ProductService) {}

	async findAllCartItems(
		userId: number
	): Promise<{ cartItems: CartItem[]; totalAmount: number; totalQuantity: number }> {
		const cartItems = await this.prisma.cartItem.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } })

		const totalAmount = cartItems.reduce((total, item) => total + item.price, 0)
		const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

		return { cartItems, totalAmount, totalQuantity }
	}

	async findOneCartItem(
		where: Prisma.CartItemWhereUniqueInput,
		select: Prisma.CartItemSelect = {}
	): Promise<CartItemFullType> {
		const defaultCartItemSelect: Prisma.CartItemSelectScalar = {
			id: true,
			createdAt: false,
			updatedAt: false,
			name: true,
			image: true,
			quantity: true,
			price: true,
			productId: true,
			userId: true
		}

		const cartItem = await this.prisma.cartItem.findUnique({
			where: where,
			select: { ...defaultCartItemSelect, ...select }
		})

		return cartItem
	}

	async findCartItemById(userId: number, cartItemId: number): Promise<CartItemFullType> {
		const cartItem = this.findOneCartItem({ id: cartItemId, userId })
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		return cartItem
	}

	async deleteAllCartItems(userId: number) {
		const deletedCartItems = await this.prisma.cartItem.deleteMany({ where: { userId } })
		return deletedCartItems
	}

	async createCartItem(userId: number, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
		const { productId, quantity } = createCartItemDto

		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) throw new NotFoundException('This product not found')

		const existingCartItem = await this.findOneCartItem({
			productId_userId: { productId, userId }
		})

		if (existingCartItem) {
			const newQuantity = existingCartItem.quantity + quantity
			const newPrice = product.price * newQuantity

			const cartItem = await this.prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					quantity: newQuantity,
					price: newPrice
				}
			})
			return cartItem
		} else {
			const cartItem = await this.prisma.cartItem.create({
				data: {
					name: product.name,
					image: product.images.length > 0 ? product.images[0] : null,
					quantity,
					price: product.price * quantity,
					product: {
						connect: { id: product.id }
					},
					user: {
						connect: { id: userId }
					}
				}
			})
			return cartItem
		}
	}

	async updateCartItem(userId: number, cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
		const cartItem = await this.findOneCartItem({ id: cartItemId, userId }, { product: true })

		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		const price = cartItem.product.price

		const updatedCartItem = await this.prisma.cartItem.update({
			where: { id: cartItemId, userId },
			data: { ...updateCartItemDto, price: price * updateCartItemDto.quantity }
		})

		return updatedCartItem
	}

	async deleteCartItem(userId: number, cartItemId: number): Promise<CartItem> {
		const cartItem = await this.findOneCartItem({ userId, id: cartItemId })
		if (!cartItem) throw new NotFoundException('This product not found inside cart')

		const deletedCartItem = await this.prisma.cartItem.delete({
			where: { id: cartItemId }
		})

		return deletedCartItem
	}

	async isProductInCart(userId: number, productId: number): Promise<{ isInCart: boolean }> {
		const product = await this.productService.findOneProduct({ id: productId })
		if (!product) {
			throw new NotFoundException('Product not found')
		}

		const cartItem = await this.findOneCartItem({ productId_userId: { productId, userId } })

		return { isInCart: !!cartItem }
	}
}
