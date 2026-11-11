'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { AdminMe } from '@/constants/adminPermissions'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'

/**
 * 로그인한 관리자의 역할·페이지 권한.
 * 서버가 요청마다 DB에서 다시 확인하므로 실제 차단은 서버가 하고, 이 값은 메뉴·페이지 표시용이다.
 * 메뉴 이동 시(AuthGuard)와 창으로 돌아올 때(React Query 기본 refetchOnWindowFocus) 다시 받아
 * 사장이 권한을 바꾸면 메뉴도 따라 바뀐다.
 */
export function useAdminMe() {
  return useQuery({
    queryKey: QUERY_KEYS.adminMe.detail(),
    queryFn: () => api.get<ApiResponse<AdminMe>>('/auth/me'),
    select: (response) => response.data,
    staleTime: 30_000,
  })
}
