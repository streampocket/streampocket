import type {
  AuthProvider,
  OwnProductStatus,
  PartyApplicationStatus,
} from '@/types/domain'

export type AdminUserListItem = {
  id: string
  email: string
  name: string
  phone: string
  phoneVerified: boolean
  provider: AuthProvider
  createdAt: string
  updatedAt: string
  hasPartner: boolean
  _count: {
    ownProducts: number
    partyApplications: number
  }
}

export type AdminUserDetailProduct = {
  id: string
  name: string
  status: OwnProductStatus
  price: number
  totalSlots: number
  filledSlots: number
  durationDays: number
  createdAt: string
  category: { id: string; name: string }
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
  }
}

export type AdminUserDetail = {
  user: {
    id: string
    email: string
    name: string
    phone: string
    phoneVerified: boolean
    provider: AuthProvider
    createdAt: string
    updatedAt: string
  }
  partner: {
    id: string
    name: string
    phone: string
    bankName: string
    bankAccount: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
  } | null
  ownProducts: AdminUserDetailProduct[]
  partyApplications: AdminUserDetailApplication[]
  termsAgreements: { type: string; agreedAt: string }[]
  stats: {
    totalPaidAmount: number
    partyCount: number
    activePartyCount: number
    ownProductCount: number
  }
}

export type UserListParams = {
  search?: string
  provider?: AuthProvider
  page?: number
  pageSize?: number
}

export type UserProviderFilter = 'all' | AuthProvider
