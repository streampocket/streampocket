import { API_BASE_URL } from '@/constants/app'
import type { OwnProduct } from '@/types/domain'

type DetailResponse = {
  data: OwnProduct
}

export async function fetchOwnProductServer(id: string): Promise<OwnProduct | null> {
  const res = await fetch(`${API_BASE_URL}/own/products/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error('파티 정보를 불러오지 못했습니다.')
  }
  const json: DetailResponse = await res.json()
  return json.data
}
