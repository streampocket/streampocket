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
  durationMode: 'countdown' | 'fixed'
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
  /** 신청 시점에 차감한 포인트. 실결제액은 totalAmount - usedPoint */
  usedPoint: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
  startedAt: string | null
  expiresAt: string | null
  createdAt: string
  product: MyApplicationProduct
  otpRegistered: boolean
  otpIssueCount: number
  /** 재구매(기간 연장) 버튼 노출 여부 — 서버가 판정 (이용 중 + 기간 유지형 + 파티 미삭제) */
  renewable: boolean
  /** 승인 대기 중인 재구매 (신청당 최대 1건) */
  pendingRenewal: { id: string; payableAmount: number; createdAt: string } | null
}

/** GET /own/applications/{id}/renewal-quote — 재구매 확인 창 */
export type RenewalQuote = {
  price: number
  /** 재구매 이벤트 할인액 (없으면 0) */
  discount: number
  fee: number
  /** price - discount + fee (포인트 차감 전) */
  totalAmount: number
  durationDays: number
  currentExpiresAt: string | null
  /** 지금 승인된다고 가정한 연장 후 만료 — 실제 연장은 관리자 승인 시각에 다시 계산된다 */
  expiresAtIfApproved: string
  hasPendingRenewal: boolean
}

// POST /own/applications/{id}/otp 응답 — 시크릿은 절대 포함되지 않음(서버가 코드만 계산)
// 발급·재발급 모두 횟수 1회 차감. 코드는 1개(교체 없음), expiresIn(30초)부터 카운트다운.
// viewExpiresAt까지 코드 표시 유지
export type OtpIssueResult = {
  code: string
  expiresIn: number
  issueCount: number
  remaining: number
  viewExpiresAt: string
}
