// 페이지 전용 타입이 필요하면 여기에 추가한다.
// 주문 목록 관련 타입(OrderListParams, OrderStatusCounts, OrderListResponse)은
// 공통 위치로 이동: types/domain.ts + hooks/useOrders.ts

// GET /steam/admin/orders/{id}/party-otp 응답 — 시크릿 원문/암호문은 절대 포함되지 않음
export type PartyOtpIssueLogItem = {
  id: string
  issuedAt: string
}

/** 드라마 계정 자동 배정 상태 — 재시도 버튼을 켤 수 있는지와 그 사유 */
export type PartyAutoAssignInfo = {
  assigned: boolean
  accountEmail: string | null
  eligible: boolean
  /** 불가 사유 코드 (가능하면 null). 문구 변환은 constants/app의 describeAutoDeliverReason */
  reason: string | null
}

export type PartyOtpInfo =
  | { linked: false }
  | {
      linked: true
      secretRegistered: boolean
      secretUpdatedAt: string | null
      issueCount: number
      maxIssues: number
      logs: PartyOtpIssueLogItem[]
      autoAssign: PartyAutoAssignInfo
    }
