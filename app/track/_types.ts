import type { FulfillmentStatus } from '@/types/domain'

/** 구매자용 진행상황 조회 응답 (백엔드 /steam/track 최소 노출 필드) */
export type OrderTracking = {
  productName: string
  fulfillmentStatus: FulfillmentStatus
  paidAt: string | null
  updatedAt: string
  returnedAt: string | null
}

/** 주문 상태를 구매자 화면 표현으로 변환한 결과 */
export type TrackView =
  | { kind: 'step'; step: 1 | 2 | 3; done: boolean }
  | { kind: 'cancelled' }
  | { kind: 'inquiry' }

/**
 * 주문 상태 → 구매자 화면 매핑
 * - pending: 1단계(대기) / in_progress: 2단계(진행중) / completed·purchase_decided: 3단계(완료)
 * - returned: 취소·환불 안내 / manual_review·failed: 문의 안내
 */
export function resolveTrackView(status: FulfillmentStatus): TrackView {
  switch (status) {
    case 'pending':
      return { kind: 'step', step: 1, done: false }
    case 'in_progress':
      return { kind: 'step', step: 2, done: false }
    case 'completed':
    case 'purchase_decided':
      return { kind: 'step', step: 3, done: true }
    case 'returned':
      return { kind: 'cancelled' }
    case 'manual_review':
    case 'failed':
      return { kind: 'inquiry' }
  }
}
