import type { ProductStatus, SteamProduct } from '@/types/domain'

export type ProductListParams = {
  status?: ProductStatus | ''
  search?: string
  page?: number
  pageSize?: number
}

export type ProductFormData = {
  name: string
  naverProductId: string
  status: ProductStatus
  goofishMonitorEnabled: boolean
  goofishSearchQuery: string | null
}

export type ProductStatusCounts = {
  total: number
  active: number
  draft: number
  inactive: number
}

export type ProductListResponse = {
  data: SteamProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  counts: ProductStatusCounts
}
