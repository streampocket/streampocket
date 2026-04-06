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
  phoneVerified: boolean
  createdAt: string
}

type ProfileResponse = {
  data: UserProfile
}

export function useUserProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.userAuth.me(),
    queryFn: () => userApi.get<ProfileResponse>('/own/users/me'),
    select: (data) => data.data,
  })
}
