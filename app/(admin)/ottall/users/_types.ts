import type {
  AuthProvider,
  OwnProductStatus,
  PartyApplicationStatus,
} from '@/types/domain'

// 탈퇴 정보 (활성 회원은 전부 null/false)
export type UserWithdrawalInfo = {
  deletedAt: string | null
  withdrawalReason: string | null
  withdrawnByAdmin: boolean
  originalEmail: string | null
  originalPhone: string | null
  purgeScheduledAt: string | null
}

export type AdminUserListItem = UserWithdrawalInfo & {
  id: string
  email: string
  name: string
  phone: string
  phoneVerified: boolean
  provider: AuthProvider
  createdAt: string
  updatedAt: string
  _count: {
    partyApplications: number
  }
}

export type AdminUserDetailApplication = {
  id: string
  status: PartyApplicationStatus
  price: number
  fee: number
  totalAmount: number
  /** 신청 시점에 차감한 포인트. 실제 받은 돈은 totalAmount - usedPoint */
  usedPoint: number
  startedAt: string | null
  expiresAt: string | null
  /** 반품(파티원 제거) 시각 — cancelled 중 반품 건 구분 + 재신청 차단 근거 */
  returnedAt: string | null
  createdAt: string
  product: {
    id: string
    name: string
    status: OwnProductStatus
    durationDays: number
    leaderName: string
    /** 파티 정가. 신청의 price와 다르면 기간 차감이 실제로 일어난 것 */
    price: number
    totalSlots: number
    filledSlots: number
    category: { id: string; name: string }
  }
}

/** 현재 유효한 반품 재신청 차단 (카테고리별 최신 1건) */
export type AdminUserReturnCooldown = {
  categoryId: string
  categoryName: string
  /** 반품된 파티명 */
  partyName: string
  returnedAt: string
  /** 재신청 가능 시각 (returnedAt + 12h) */
  retryAt: string
}

export type AdminUserDetail = {
  user: UserWithdrawalInfo & {
    id: string
    email: string
    name: string
    phone: string
    phoneVerified: boolean
    provider: AuthProvider
    /** 현재 보유 포인트 */
    pointBalance: number
    createdAt: string
    updatedAt: string
  }
  partyApplications: AdminUserDetailApplication[]
  returnCooldowns: AdminUserReturnCooldown[]
  termsAgreements: { type: string; agreedAt: string }[]
  stats: {
    totalPaidAmount: number
    partyCount: number
    activePartyCount: number
  }
}

export type UserStatusFilter = 'active' | 'withdrawn'

export type UserListParams = {
  search?: string
  provider?: AuthProvider
  status?: UserStatusFilter
  page?: number
  pageSize?: number
}

export type UserProviderFilter = 'all' | AuthProvider | 'withdrawn'
