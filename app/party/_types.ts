import type { OwnProductStatus } from '@/types/domain'

export type ProductSort = 'price_asc' | 'price_desc'

export type ProductListParams = {
  categoryId?: string
  status?: OwnProductStatus
  sort?: ProductSort
}
