import type { PartyApplicationStatus } from '@/types/domain'

export type ApplicationTabStatus = PartyApplicationStatus | 'all'

export type AdminApplicationListItem = {
  id: string
  status: PartyApplicationStatus
  price: number
  fee: number
  totalAmount: number
  startedAt: string | null
  expiresAt: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
  product: {
    id: string
    name: string
    durationDays: number
    category: { id: string; name: string }
  }
}

export type AdminApplicationDetail = AdminApplicationListItem & {
  product: AdminApplicationListItem['product'] & {
    totalSlots: number
    filledSlots: number
  }
}

export type AdminApplicationListParams = {
  status?: PartyApplicationStatus
  search?: string
  page?: number
  pageSize?: number
}
