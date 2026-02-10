export interface CartRes {
  status: string
  message?: string
  numOfCartItems: number
  cartId: string
  data: Cart
}

export interface Cart {
  _id: string
  cartOwner: string
  products: CartItem[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
}

export interface CartItem {
  count: number
  _id: string
  product: Product
  price: number
}

export interface Product {
    subCategory: Subcategory[]
    _id: string
    title: string
    quantity: number
    imageCover: string
    category: Category
    brand: Brand
    ratingsAverage: number
    id: string
}
export interface Subcategory {
    _id: string
    name: string
    slug: string
    category: string
}
export interface Category {
    _id: string
    name: string
    slug: string
    image: string
}
export interface Brand {
    _id: string
    name: string
    slug: string
    image: string
}