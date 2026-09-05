import type { PartyApplicationStatus, PartyType, PartyDurationMode } from '@/types/domain'

export type ApplicationTabStatus = PartyApplicationStatus | 'all'

export type AdminApplicationListItem = {
  id: string
  status: PartyApplicationStatus
  price: number
  fee: number
  totalAmount: number
  /** 신청 시점에 차감한 포인트. 실제 받은 돈은 totalAmount - usedPoint */
  usedPoint: number
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

/** 자동 배정이 막히는 이유 — 승인 모달이 토글 옆에 사유로 보여준다 */
export type AutoDeliverReason =
  | 'not_found'
  | 'not_confirmed'
  | 'already_assigned'
  | 'already_has_secret'
  | 'unmapped_party'
  | 'no_account'

export type AssignedDramaAccount = {
  id: string
  email: string
  /** 'YYYY-MM-DD' */
  dueAt: string | null
  freeSlots: number
}

/** 승인 전 미리보기 — "지금 승인하면 어떤 계정이 배정되는지" */
export type AutoDeliverPreview = {
  eligible: boolean
  reason: AutoDeliverReason | null
  account: AssignedDramaAccount | null
}

/** 확정 건에 실제로 배정된 계정 (비밀번호·OTP 시크릿은 내려오지 않는다) */
export type AssignedAccountSummary = {
  id: string
  email: string
  platform: string | null
  /** 'YYYY-MM-DD' */
  dueAt: string | null
}

export type AdminApplicationDetail = AdminApplicationListItem & {
  product: AdminApplicationListItem['product'] & {
    totalSlots: number
    filledSlots: number
  }
  alimtalkLogs: AdminAlimtalkLog[]
  autoDeliverPreview: AutoDeliverPreview
  dramaAccount: AssignedAccountSummary | null
}

export type AdminApplicationListParams = {
  status?: PartyApplicationStatus
  search?: string
  page?: number
  pageSize?: number
}
