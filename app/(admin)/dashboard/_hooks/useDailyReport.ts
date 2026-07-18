import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DailyReport } from '../_types'
import type { ApiResponse } from '@/types/api'

// 캘린더 날짜 클릭 시에만 조회 (모달 열림 = date 존재)
export function useDailyReport(date: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.dailyReport(date ?? ''),
    queryFn: () => api.get<ApiResponse<DailyReport>>(`/steam/admin/dashboard/daily-report?date=${date}`),
    select: (res) => res.data,
    enabled: date !== null,
  })
}
