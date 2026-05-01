export type MyPageTab = 'profile' | 'purchases'

export type MyApplicationProduct = {
  id: string
  name: string
  durationDays: number
  price: number
  totalSlots: number
  filledSlots: number
  imagePath: string | null
  status: string
  category: {
    id: string
    name: string
  }
}

export type MyApplication = {
  id: string
  productId: string
  price: number
  fee: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
  startedAt: string | null
  expiresAt: string | null
  createdAt: string
  product: MyApplicationProduct
}

export type ApplicationCredentials = {
  productName: string
  accountId: string | null
  accountPassword: string | null
}
