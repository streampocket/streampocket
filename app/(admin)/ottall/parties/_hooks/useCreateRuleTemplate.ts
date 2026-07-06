'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RuleTemplate } from '../_types'

export type CreateRuleTemplateInput = {
  name: string
  content: string
}

type CreateResponse = {
  data: RuleTemplate
}

export function useCreateRuleTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRuleTemplateInput) =>
      api.post<CreateResponse>('/own/admin/rule-templates', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownRuleTemplates.all() })
    },
  })
}
