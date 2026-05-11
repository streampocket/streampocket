import { API_BASE_URL } from '@/constants/app'
import type { OwnCategory, OwnReview } from '@/types/domain'

type ListResponse = {
  data: {
    items: OwnReview[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

type DetailResponse = {
  data: OwnReview
}

type CategoriesResponse = {
  data: OwnCategory[]
}

type ProductsResponse = {
  data: { id: string; name: string }[]
}

export type ReviewListServerParams = {
  productId?: string
  categoryId?: string
  sort?: 'latest' | 'rating'
  page?: number
  pageSize?: number
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchReviewsServer(params: ReviewListServerParams) {
  const qs = buildQuery(params)
  const res = await fetch(`${API_BASE_URL}/own/reviews${qs}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('리뷰 목록을 불러오지 못했습니다.')
  }
  const json: ListResponse = await res.json()
  return json.data
}

export async function fetchReviewServer(id: string): Promise<OwnReview | null> {
  const res = await fetch(`${API_BASE_URL}/own/reviews/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error('리뷰를 불러오지 못했습니다.')
  }
  const json: DetailResponse = await res.json()
  return json.data
}

export async function fetchOwnCategoriesServer(): Promise<OwnCategory[]> {
  const res = await fetch(`${API_BASE_URL}/own/categories`, { cache: 'no-store' })
  if (!res.ok) return []
  const json: CategoriesResponse = await res.json()
  return json.data
}

export async function fetchOwnProductsLiteServer(categoryId?: string) {
  const qs = buildQuery({ categoryId })
  const res = await fetch(`${API_BASE_URL}/own/products${qs}`, { cache: 'no-store' })
  if (!res.ok) return []
  const json: ProductsResponse = await res.json()
  return json.data
}
