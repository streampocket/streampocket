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
  startedAt: string | null
  expiresAt: string | null
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
    category: { name: string }
  }
}

export type AdminUserDetail = {
  user: UserWithdrawalInfo & {
    id: string
    email: string
    name: string
    phone: string
    phoneVerified: boolean
    provider: AuthProvider
    createdAt: string
    updatedAt: string
  }
  partyApplications: AdminUserDetailApplication[]
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
