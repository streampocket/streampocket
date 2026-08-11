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
  /** 신청 시점에 차감한 포인트. 실결제액은 totalAmount - usedPoint */
  usedPoint: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
  startedAt: string | null
  expiresAt: string | null
  createdAt: string
  product: MyApplicationProduct
  otpRegistered: boolean
  otpIssueCount: number
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
