/** 주문 처리 상태 (Prisma FulfillmentStatus 기준) */
export type FulfillmentStatus = 'pending' | 'completed' | 'manual_review' | 'failed' | 'returned'

/** 계정 상태 (Prisma AccountStatus 기준) */
export type AccountStatus = 'available' | 'reserved' | 'sent' | 'disabled' | 'manual'

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
  templateCode: string | null
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
  settlementAmount: number | null
  decisionDate: string | null
  fulfillmentStatus: FulfillmentStatus
  errorMessage: string | null
  paidAt: string | null
  returnedAt: string | null
  reviewGameSentAt: string | null
  friendLink1: string | null
  friendLink2: string | null
  giftCompletedAt: string | null
  createdAt: string
  updatedAt: string
  deliveryLogs?: DeliveryLog[]
}

/** 스팀 상품 */
export type SteamProduct = {
  id: string
  name: string
  naverProductId: string
  price: number | null
  discountPricePc: number | null
  discountPriceMobile: number | null
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
  secondaryEmail: string | null
  secondaryEmailPassword: string | null
  secondaryEmailSiteUrl: string | null
  status: AccountStatus
  createdAt: string
}

/** 비용 카테고리 */
export type ExpenseCategory = 'game_purchase' | 'country_change' | 'review_game' | 'other'

/** 비용 결제자 */
export type ExpensePayer = 'song_donggeon' | 'im_jeongbin'

/** 비용 항목 */
export type Expense = {
  id: string
  date: string
  category: ExpenseCategory
  payer: ExpensePayer
  amount: number
  memo: string | null
  createdAt: string
  updatedAt: string
}

/** 매출 비용 내역 */
export type RevenueCosts = {
  naverCommission: number
  gamePurchase: number
  countryChange: number
  reviewGame: number
  other: number
}

/** 매출 통계 */
export type RevenueData = {
  totalRevenue: number
  totalSettlement: number
  costs: RevenueCosts
  totalCosts: number
  netProfit: number
  pendingSettlement: number
  alimtalkCount: number
}

/** 수동 매출 */
export type ManualRevenue = {
  id: string
  date: string
  amount: number
  memo: string | null
  createdAt: string
  updatedAt: string
}

/** 대시보드 통계 */
export type DashboardStats = {
  totalOrders: number
  confirmedOrders: number
  pendingDecisionOrders: number
  returnedOrders: number
  revenue: RevenueData
}

/** 매출 차트 아이템 */
export type RevenueChartItem = {
  date: string
  totalRevenue: number
  netProfit: number
}

/** 상품별 매출 랭킹 아이템 */
export type ProductRankingItem = {
  productName: string
  orderCount: number
  totalRevenue: number
}

/** 대시보드 추가 정보 */
export type DashboardExtras = {
  productRanking: ProductRankingItem[]
  averageDecisionDays: number
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
    templateCodeNASecondary: string | null
    templateCodeReviewGame: string | null
    templateCodeGiftCompleted: string | null
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

// ───────────────────────── 인증 (OTTALL) ─────────────────────────

/** 가입 방식 */
export type AuthProvider = 'local' | 'kakao' | 'google'

// ───────────────────────── OTT 상품 (OTTALL) ─────────────────────────

/** OTT 상품 상태 */
export type OwnProductStatus = 'recruiting' | 'closed' | 'expired'

/** OTT 카테고리 */
export type OwnCategory = {
  id: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/** OTT 파티 */
export type OwnProduct = {
  id: string
  name: string
  categoryId: string
  category: OwnCategory
  durationDays: number
  price: number
  dailyDiscount: number
  totalSlots: number
  filledSlots: number
  imagePath: string | null
  notes: string | null
  hasCredentials: boolean
  status: OwnProductStatus
  startedAt: string | null
  userId: string
  user: { id: string; name: string }
  currentPrice: number
  partyExpiresAt: string | null
  remainingDays: number
  createdAt: string
  updatedAt: string
}

/** 상품 목록 조회 파라미터 */
export type ProductListParams = {
  categoryId?: string
  status?: OwnProductStatus
}

// ───────────────────────── 파트너 (OTTALL) ─────────────────────────

/** 파트너 상태 */
export type PartnerStatus = 'pending' | 'approved' | 'rejected'

/** 파트너 */
export type Partner = {
  id: string
  userId: string
  name: string
  phone: string
  bankName: string
  bankAccount: string
  status: PartnerStatus
  rejectedAt: string | null
  rejectionNote: string | null
  createdAt: string
  updatedAt: string
}

// ───────────────────────── 파티 신청 (OTTALL) ─────────────────────────

/** 파티 신청 상태 */
export type PartyApplicationStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired'

/** 파티 신청 */
export type PartyApplication = {
  id: string
  productId: string
  userId: string
  price: number
  fee: number
  totalAmount: number
  status: PartyApplicationStatus
  startedAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

// ───────────────────────── 파티 상세 (관리자) ─────────────────────────

/** 파티 상세 (참여자 포함) */
export type AdminPartyDetail = Omit<OwnProduct, 'user'> & {
  user: {
    id: string
    name: string
    phone: string
    partner: {
      phone: string
      bankName: string
      bankAccount: string
    } | null
  }
  applications: (PartyApplication & {
    user: { id: string; name: string; email: string; phone: string }
  })[]
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
