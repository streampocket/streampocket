/** 주문 처리 상태 (Prisma FulfillmentStatus 기준) */
export type FulfillmentStatus = 'pending' | 'completed' | 'manual_review' | 'failed'

/** 계정 상태 (Prisma AccountStatus 기준) */
export type AccountStatus = 'available' | 'reserved' | 'sent' | 'disabled'

/** 상품 상태 (Prisma ProductStatus 기준) */
export type ProductStatus = 'draft' | 'active' | 'inactive'

/** 발송 채널 */
export type DeliveryChannel = 'alimtalk'

/** 발송 이력 상태 */
export type DeliveryLogStatus = 'queued' | 'sent' | 'failed'

/** 발송 이력 */
export type DeliveryLog = {
  id: string
  orderItemId: string
  channel: DeliveryChannel
  recipient: string
  status: DeliveryLogStatus
  errorMessage: string | null
  providerMessageId: string | null
  sentAt: string | null
  createdAt: string
}

/** 스팀 주문 아이템 */
export type SteamOrderItem = {
  id: string
  productOrderId: string
  naverOrderId: string
  productId: string | null
  accountId: string | null
  productName: string
  receiverPhoneNumber: string | null
  receiverName: string | null
  unitPrice: number
  fulfillmentStatus: FulfillmentStatus
  errorMessage: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  deliveryLogs?: DeliveryLog[]
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
  productId: string | null
  productName: string | null
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

export type AlimtalkTemplate = {
  senderKey: string | null
  templateCode: string | null
  templateName: string | null
  templateContent: string | null
  status: string | null
  inspectStatus: string | null
}

export type AlimtalkSettings = {
  enabled: boolean
  runtime: {
    apiKeyConfigured: boolean
    userId: string | null
    senderKey: string | null
    templateCodeNA: string | null
    templateCodeAA: string | null
    sender: string | null
    providerConnected: boolean
    providerMessage: string
    activeTemplate: AlimtalkTemplate | null
    templates: AlimtalkTemplate[]
  }
}

export type AlimtalkTestResult = {
  recipient: string
  providerMessageId: string | null
  providerMessage: string
}

/** 리뷰 코드 상태 */
export type ReviewCodeStatus = 'unused' | 'used'

/** 리뷰 게임 코드 */
export type ReviewCode = {
  id: string
  gameName: string | null
  code: string
  status: ReviewCodeStatus
  usedBy: string | null
  usedAt: string | null
  createdAt: string
  updatedAt: string
}
