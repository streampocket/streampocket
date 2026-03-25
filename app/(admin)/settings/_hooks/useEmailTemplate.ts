import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { EmailTemplate } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useEmailTemplate() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEYS.settings.emailTemplate(),
    queryFn: () => api.get<ApiResponse<EmailTemplate>>('/steam/admin/email-template'),
    select: (res) => res.data,
  })

  const mutation = useMutation({
    mutationFn: (data: { subject: string; bodyTemplate: string }) =>
      api.patch('/steam/admin/email-template', data),
    onSuccess: () => {
      toast.success('이메일 템플릿이 저장되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.emailTemplate() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '저장에 실패했습니다.')
    },
  })

  return { query, mutation }
}
