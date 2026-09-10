import { cache } from 'react'
import { API_BASE_URL } from '@/constants/app'
import type { OwnCategory, OwnProduct } from '@/types/domain'

type DetailResponse = {
  data: OwnProduct
}

type ListResponse = {
  data: OwnProduct[]
}

type CategoriesResponse = {
  data: OwnCategory[]
}

/**
 * 파티 상세 — 신청 직전 화면이라 모집 현황이 실시간이어야 해서 `no-store`를 유지한다.
 *
 * `cache()`로 감싸는 이유: `generateMetadata`와 페이지 본문이 각각 호출해 같은 요청에서
 * fetch가 두 번 나가고 있었다. 같은 요청 안에서만 dedupe하므로 실시간성은 그대로다.
 */
export const fetchOwnProductServer = cache(async (id: string): Promise<OwnProduct | null> => {
  const res = await fetch(`${API_BASE_URL}/own/products/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error('파티 정보를 불러오지 못했습니다.')
  }
  const json: DetailResponse = await res.json()
  return json.data
})

/** 목록 조회의 캐시 시간 — `no-store`면 매 요청 API를 타서 응답이 느려지고 검색에 불리하다 */
const LIST_REVALIDATE_SECONDS = 60

type ListParams = {
  categoryId?: string
  status?: 'recruiting' | 'closed' | 'expired'
  sort?: 'price_asc' | 'price_desc'
}

/**
 * 파티 목록을 서버에서 미리 받는다 — 크롤러가 받는 HTML에 파티 링크를 심기 위한 것이다.
 *
 * 지금 `/party`는 클라이언트에서 목록을 받아오므로 초기 HTML에 링크가 하나도 없고,
 * JS 실행이 약한 네이버 크롤러(Yeti)는 목록을 빈 화면으로 본다.
 * 실패 시 빈 배열을 돌려 클라이언트 조회가 이어받게 한다(화면이 깨지지 않는다).
 */
export const fetchOwnProductsServer = cache(
  async (params: ListParams = {}): Promise<OwnProduct[]> => {
    const search = new URLSearchParams()
    if (params.categoryId) search.set('categoryId', params.categoryId)
    if (params.status) search.set('status', params.status)
    if (params.sort) search.set('sort', params.sort)
    const qs = search.toString()

    try {
      const res = await fetch(`${API_BASE_URL}/own/products${qs ? `?${qs}` : ''}`, {
        next: { revalidate: LIST_REVALIDATE_SECONDS },
      })
      if (!res.ok) return []
      const json: ListResponse = await res.json()
      return json.data
    } catch {
      return []
    }
  },
)

/** 카테고리 목록 — 바뀌는 일이 드물어 길게 캐시한다 */
export const fetchOwnCategoriesForListServer = cache(async (): Promise<OwnCategory[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/own/categories`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const json: CategoriesResponse = await res.json()
    return json.data
  } catch {
    return []
  }
})
