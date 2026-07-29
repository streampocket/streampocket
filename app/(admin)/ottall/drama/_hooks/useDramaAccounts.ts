'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DramaAccount, ImportResult, TextSaveResult } from '../_types'

const BASE = '/own/admin/drama-accounts'

type ListResponse = { data: DramaAccount[] }

/** 전건 조회 — 필터·검색·정렬은 화면에서 처리하므로 서버에 조건을 넘기지 않는다 */
export function useDramaAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.dramaAccounts.all(),
    queryFn: () => api.get<ListResponse>(BASE),
    select: (res) => res.data,
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dramaAccounts.all() })
}

/**
 * 계정 1건을 메모 텍스트로 저장한다.
 * `dryRun`이면 저장하지 않고 파싱 결과와 변화 요약만 돌려준다 — 미리보기와 저장이 같은 API다.
 * `id`가 없으면 신규 등록, 있으면 그 계정을 통째로 교체한다.
 */
export function useSaveDramaAccountText() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, text, dryRun }: { id?: string; text: string; dryRun: boolean }) =>
      id
        ? api.put<{ data: TextSaveResult }>(`${BASE}/${id}/text`, { text, dryRun })
        : api.post<{ data: TextSaveResult }>(`${BASE}/text`, { text, dryRun }),
    onSuccess: (_res, variables) => {
      if (!variables.dryRun) invalidate()
    },
  })
}

export function useDeleteDramaAccount() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => api.delete<{ message: string }>(`${BASE}/${id}`),
    onSuccess: invalidate,
  })
}

export function useDeleteDramaMember() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ accountId, memberId }: { accountId: string; memberId: string }) =>
      api.delete<{ message: string }>(`${BASE}/${accountId}/members/${memberId}`),
    onSuccess: invalidate,
  })
}

export function useClearExpiredMembers() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (accountId: string) =>
      api.delete<{ message: string; removed: number }>(`${BASE}/${accountId}/members/expired`),
    onSuccess: invalidate,
  })
}

/** 붙여넣기 이관 — dryRun이면 저장하지 않고 읽은 결과만 돌려준다 (미리보기와 저장이 같은 API) */
export function useImportDramaMemo() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (payload: { text: string; dryRun: boolean; duplicateMode: 'skip' | 'overwrite' }) =>
      api.post<{ data: ImportResult }>(`${BASE}/import`, payload),
    onSuccess: (_res, variables) => {
      if (!variables.dryRun) invalidate()
    },
  })
}
