export type GcoinProductStatus = 'on_sale' | 'hidden' | 'sold_out'

export type GcoinProductCategory = 'gcoin' | 'item'

export type GcoinProduct = {
  id: string
  name: string
  category: GcoinProductCategory
  /** 지코인 상품만 값 존재, 아이템 상품은 null */
  gcoinAmount: number | null
  salePrice: number
  /** 원화 정가 — 달러 정가가 있으면 BE가 환율 환산값(100원 단위)으로 내려줌. 환산액이 판매가 이하이거나 환율 미확보면 null */
  listPrice: number | null
  /** 달러 정가 원본 (gcoin 카테고리 전용) */
  listPriceUsd: number | null
  description: string | null
  imageUrl: string | null
  sortOrder: number
  purchaseCount: number
  status: GcoinProductStatus
  createdAt: string
  updatedAt: string
}

export type GcoinProductTabStatus = 'all' | GcoinProductStatus

export type GcoinProductTabCategory = 'all' | GcoinProductCategory

export type AdminGcoinProductListParams = {
  status?: GcoinProductStatus
  category?: GcoinProductCategory
  search?: string
  page?: number
  pageSize?: number
}
