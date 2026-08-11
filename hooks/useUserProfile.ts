'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'

type UserProfile = {
  id: string
  email: string
  name: string
  phone: string
  provider: 'local' | 'kakao' | 'google'
  loginMethods: ('local' | 'kakao' | 'google')[]
  phoneVerified: boolean
  /** 보유 포인트 — localStorage 캐시가 아니라 항상 서버 값을 쓴다 */
  pointBalance: number
  createdAt: string
}

type ProfileResponse = {
  data: UserProfile
}

type Options = {
  /** 로그인 상태에서만 부르고 싶을 때 (헤더 드롭다운 등) */
  enabled?: boolean
}

export function useUserProfile(options?: Options) {
  return useQuery({
    queryKey: QUERY_KEYS.userAuth.me(),
    queryFn: () => userApi.get<ProfileResponse>('/own/users/me'),
    select: (data) => data.data,
    enabled: options?.enabled ?? true,
  })
}
