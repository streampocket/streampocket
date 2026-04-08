import type { PaymentStatus } from '@/types/domain'

export type PaymentTabStatus = 'all' | PaymentStatus

export type AdminPaymentListParams = {
  status?: PaymentStatus
  from?: string
  to?: string
  page?: number
  pageSize?: number
}
