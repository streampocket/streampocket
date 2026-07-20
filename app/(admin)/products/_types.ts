import type {
  ProductStatus,
  SteamProduct,
  SteamGame,
  SteamProductType,
  Store,
} from '@/types/domain'

export type ProductListParams = {
  status?: ProductStatus | ''
  search?: string
  page?: number
  pageSize?: number
}

// === 멀티스토어 게임 (상품관리 페이지) ===
export type GameListParams = {
  store?: Store | ''
  search?: string
  page?: number
  pageSize?: number
}

// 드롭다운용 경량 게임 옵션 (GET /steam/admin/games/options)
export type GameOption = {
  id: string
  name: string
  productType: SteamProductType
}

export type GameStoreCounts = {
  total: number
  streampocket: number
  pokemon_steam: number
}

export type GameListResponse = {
  data: SteamGame[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  counts: GameStoreCounts
}

export type ProductFormData = {
  name: string
  naverProductId: string
  status: ProductStatus
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
