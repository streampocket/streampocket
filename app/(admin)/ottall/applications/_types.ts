import type { PartyApplicationStatus, PartyType, PartyDurationMode } from '@/types/domain'

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
    partyType: PartyType
    durationMode: PartyDurationMode
    category: { id: string; name: string }
  }
}

export type AdminAlimtalkLog = {
  id: string
  status: 'queued' | 'sent' | 'failed'
  templateCode: string | null
  errorMessage: string | null
  sentAt: string | null
  createdAt: string
}

export type AdminApplicationDetail = AdminApplicationListItem & {
  product: AdminApplicationListItem['product'] & {
    totalSlots: number
    filledSlots: number
  }
  alimtalkLogs: AdminAlimtalkLog[]
}

export type AdminApplicationListParams = {
  status?: PartyApplicationStatus
  search?: string
  page?: number
  pageSize?: number
}
