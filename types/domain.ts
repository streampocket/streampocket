/** 주문 처리 상태 (Prisma FulfillmentStatus 기준) */
export type FulfillmentStatus = 'pending' | 'completed' | 'manual_review' | 'failed'

/** 계정 상태 (Prisma AccountStatus 기준) */
export type AccountStatus = 'available' | 'reserved' | 'sent' | 'disabled'

/** 상품 상태 (Prisma ProductStatus 기준) */
export type ProductStatus = 'draft' | 'active' | 'inactive'

/** 이메일 발송 상태 */
export type EmailLogStatus = 'queued' | 'sent' | 'failed'

/** 스팀 주문 아이템 */
export type SteamOrderItem = {
  id: string
  productOrderId: string
  naverOrderId: string
  productId: string | null
  accountId: string | null
  productName: string
  buyerEmail: string | null
  unitPrice: number
  fulfillmentStatus: FulfillmentStatus
  errorMessage: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

/** 스팀 상품 */
export type SteamProduct = {
  id: string
  name: string
  naverProductId: string
  status: ProductStatus
  stockCount: number
  createdAt: string
  updatedAt: string
}

/** 스팀 계정 재고 */
export type SteamAccount = {
  id: string
  productId: string
  username: string
  password: string
  email: string
  emailPassword: string
  emailSiteUrl: string
  status: AccountStatus
  createdAt: string
}

/** 대시보드 통계 */
export type DashboardStats = {
  todayOrders: number
  pendingOrders: number
  manualReviewOrders: number
  lowStockProducts: number
}

/** 이메일 템플릿 */
export type EmailTemplate = {
  id: string
  subject: string
  bodyTemplate: string
  updatedAt: string
}
