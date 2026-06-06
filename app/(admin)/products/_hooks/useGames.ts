import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { PRODUCTS_PAGE_SIZE } from '@/constants/app'
import type { GameListParams, GameListResponse } from '../_types'

export function useGames(params: GameListParams = {}) {
  const { store, search, page = 1, pageSize = PRODUCTS_PAGE_SIZE } = params
  const searchParams = new URLSearchParams()
  searchParams.set('page', String(page))
  searchParams.set('pageSize', String(pageSize))
  if (store) searchParams.set('store', store)
  if (search) searchParams.set('search', search)

  return useQuery({
    queryKey: QUERY_KEYS.games.list({ store, search, page, pageSize }),
    queryFn: () => api.get<GameListResponse>(`/steam/admin/games?${searchParams.toString()}`),
  })
}
