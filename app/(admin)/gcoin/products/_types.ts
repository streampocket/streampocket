export type GcoinProductStatus = 'on_sale' | 'hidden' | 'sold_out'

export type GcoinProduct = {
  id: string
  name: string
  gcoinAmount: number
  salePrice: number
  listPrice: number | null
  description: string | null
  imageUrl: string | null
  sortOrder: number
  purchaseCount: number
  status: GcoinProductStatus
  createdAt: string
  updatedAt: string
}

export type GcoinProductTabStatus = 'all' | GcoinProductStatus

export type AdminGcoinProductListParams = {
  status?: GcoinProductStatus
  search?: string
  page?: number
  pageSize?: number
}
