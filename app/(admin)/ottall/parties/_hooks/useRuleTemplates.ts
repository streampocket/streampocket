'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RuleTemplate } from '../_types'

type RuleTemplatesResponse = {
  data: RuleTemplate[]
}

export function useRuleTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.ownRuleTemplates.list(),
    queryFn: () => api.get<RuleTemplatesResponse>('/own/admin/rule-templates'),
  })
}
