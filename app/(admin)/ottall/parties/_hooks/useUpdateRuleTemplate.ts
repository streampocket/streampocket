'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RuleTemplate } from '../_types'

export type UpdateRuleTemplateInput = {
  name?: string
  content?: string
}

type UpdateResponse = {
  data: RuleTemplate
}

export function useUpdateRuleTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRuleTemplateInput }) =>
      api.patch<UpdateResponse>(`/own/admin/rule-templates/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownRuleTemplates.all() })
    },
  })
}
