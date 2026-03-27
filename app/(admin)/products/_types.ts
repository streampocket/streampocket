import type { ProductStatus } from '@/types/domain'

export type ProductListParams = {
  status?: ProductStatus | ''
}

export type ProductFormData = {
  name: string
  naverProductId: string
  status: ProductStatus
}
