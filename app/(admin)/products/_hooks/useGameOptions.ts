import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamProductType } from '@/types/domain'
import type { GameOption } from '../_types'

// 드롭다운용 게임 옵션 목록 — 계정관리는 NA·BG만 조회 (AA는 계정 재고 미사용)
export function useGameOptions(productTypes?: readonly SteamProductType[]) {
  const query = productTypes?.length ? `?productTypes=${productTypes.join(',')}` : ''
  return useQuery({
    queryKey: QUERY_KEYS.games.options(productTypes),
    queryFn: () => api.get<{ data: GameOption[] }>(`/steam/admin/games/options${query}`),
  })
}
