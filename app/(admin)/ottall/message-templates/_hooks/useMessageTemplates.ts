'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { MessageTemplate, MessageTemplateInput } from '../_types'

const BASE = '/own/admin/message-templates'

type ListResponse = ApiResponse<MessageTemplate[]>

export function useMessageTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.ownMessageTemplates.list(),
    queryFn: () => api.get<ListResponse>(BASE),
    select: (res) => res.data,
  })
}

function useInvalidateMessageTemplates() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownMessageTemplates.all() })
}

export function useCreateMessageTemplate() {
  const invalidate = useInvalidateMessageTemplates()
  return useMutation({
    mutationFn: (input: MessageTemplateInput) =>
      api.post<ApiResponse<MessageTemplate>>(BASE, input),
    onSuccess: () => {
      toast.success('양식을 추가했습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateMessageTemplate() {
  const invalidate = useInvalidateMessageTemplates()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MessageTemplateInput }) =>
      api.patch<ApiResponse<MessageTemplate>>(`${BASE}/${id}`, input),
    onSuccess: () => {
      toast.success('양식을 수정했습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteMessageTemplate() {
  const invalidate = useInvalidateMessageTemplates()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`${BASE}/${id}`),
    onSuccess: () => {
      toast.success('양식을 삭제했습니다.')
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

// 순서 변경 — 화면을 먼저 바꾸고(낙관적), 서버가 거부하면(그사이 목록 변경 등) 되돌린 뒤 최신 목록을 다시 받는다
export function useReorderMessageTemplates() {
  const queryClient = useQueryClient()
  const listKey = QUERY_KEYS.ownMessageTemplates.list()

  return useMutation({
    mutationFn: (ids: string[]) => api.patch<ListResponse>(`${BASE}/reorder`, { ids }),
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: listKey })
      const previous = queryClient.getQueryData<ListResponse>(listKey)
      if (previous) {
        const byId = new Map(previous.data.map((template) => [template.id, template]))
        const reordered = ids.flatMap((id) => byId.get(id) ?? [])
        queryClient.setQueryData<ListResponse>(listKey, { ...previous, data: reordered })
      }
      return { previous }
    },
    onError: (error: Error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous)
      toast.error(error.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownMessageTemplates.all() }),
  })
}
