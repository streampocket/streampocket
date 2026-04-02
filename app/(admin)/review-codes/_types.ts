import type { ReviewCode, ReviewCodeStatus } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

export type ReviewCodeListParams = {
  status?: ReviewCodeStatus
  gameName?: string
  dateOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export type ReviewCodeListResponse = PaginatedResponse<ReviewCode>

export type ReviewCodeFormData = {
  gameName?: string
  code: string
}

export type ReviewCodeStatusData = {
  status: ReviewCodeStatus
  usedBy?: string
}
