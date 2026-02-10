export interface BrandsRes  {
  data: Brands[]
}

export interface Brands {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
}
