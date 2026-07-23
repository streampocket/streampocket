'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OwnProduct } from '@/types/domain'

type DuplicateResponse = {
  data: OwnProduct
}

// 동일 파티 복제 생성 — 파티가 정원을 채워 모집완료된 직후 "똑같은 파티 재생성" 확인에서 호출.
// 서버가 원본에서 설정 필드 전부를 복사하고 모집 상태는 초기화(모집중, 인원 0)한다.
export function useDuplicateParty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) =>
      api.post<DuplicateResponse>(`/own/admin/products/${productId}/duplicate`, {}),
    onSuccess: () => {
      toast.success('동일한 파티를 새로 생성했습니다. (모집중)')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminParties.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '파티 복제 생성에 실패했습니다.')
    },
  })
}
