import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SaveDailyMemoInput } from '../_types'
import type { ApiResponse } from '@/types/api'

// 빈 content 저장 = 메모 삭제 (백엔드 upsert 규칙)
export function useSaveDailyMemo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SaveDailyMemoInput) =>
      api.put<ApiResponse<{ memo: string | null }>>('/steam/admin/dashboard/daily-memo', input),
    onSuccess: (_res, input) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.dailyReport(input.date) })
      // 셀 📝 표시 갱신 — 월·스토어 조합 전체 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.calendarAll() })
    },
  })
}
