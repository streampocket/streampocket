import type { Partner, OwnProduct } from '@/types/domain'

export type AdminPartnerWithUser = Partner & {
  user: { id: string; email: string; name: string }
}

export type AdminPartnerDetail = {
  partner: AdminPartnerWithUser
  products: OwnProduct[]
}

export type PartnerTabStatus = 'all' | 'pending' | 'approved' | 'rejected'
