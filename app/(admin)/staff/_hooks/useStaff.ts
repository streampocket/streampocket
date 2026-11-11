'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AdminPermission } from '@/constants/adminPermissions'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { StaffAccount } from '../_types'

const BASE = '/admin/staff'

export function useStaffList() {
  return useQuery({
    queryKey: QUERY_KEYS.staff.all(),
    queryFn: () => api.get<ApiResponse<StaffAccount[]>>(BASE),
    select: (res) => res.data,
  })
}

function useInvalidateStaff() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staff.all() })
}

type CreateStaffInput = {
  email: string
  password: string
  permissions: AdminPermission[]
}

export function useCreateStaff() {
  const invalidate = useInvalidateStaff()
  return useMutation({
    mutationFn: (input: CreateStaffInput) => api.post<ApiResponse<StaffAccount>>(BASE, input),
    onSuccess: () => {
      toast.success('직원 계정을 만들었습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

type UpdateStaffInput = {
  id: string
  permissions?: AdminPermission[]
  isActive?: boolean
}

// 권한·활성 여부 변경 — 서버가 요청마다 다시 확인하므로 직원의 다음 클릭부터 바로 적용된다
export function useUpdateStaff() {
  const invalidate = useInvalidateStaff()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateStaffInput) =>
      api.patch<ApiResponse<StaffAccount>>(`${BASE}/${id}`, body),
    onSuccess: () => {
      toast.success('저장했습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useResetStaffPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      api.post<void>(`${BASE}/${id}/password`, { password }),
    onSuccess: () => toast.success('비밀번호를 바꿨습니다.'),
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteStaff() {
  const invalidate = useInvalidateStaff()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`${BASE}/${id}`),
    onSuccess: () => {
      toast.success('직원 계정을 삭제했습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
