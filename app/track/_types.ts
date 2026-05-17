import type { FulfillmentStatus } from '@/types/domain'

/** 구매자용 진행상황 조회 응답 (백엔드 /steam/track 최소 노출 필드) */
export type OrderTracking = {
  productName: string
  fulfillmentStatus: FulfillmentStatus
  paidAt: string | null
  updatedAt: string
  returnedAt: string | null
  estimatedCompletedAt: string | null
  /** 관리자/시스템이 발송완료 처리한 시각. 진행사항 완료(3단계) 판정 기준. */
  completedAt: string | null
}

/** 주문 상태를 구매자 화면 표현으로 변환한 결과 */
export type TrackView =
  | { kind: 'step'; step: 1 | 2 | 3; done: boolean }
  | { kind: 'cancelled' }
  | { kind: 'inquiry' }

/**
 * 주문 상태 → 구매자 화면 매핑
 * - pending: 1단계(대기) / in_progress: 2단계(진행중)
 * - completed·purchase_decided: 발송완료(completedAt) 기록이 있어야 3단계(완료),
 *   없으면 관리자가 아직 완료 처리하지 않은 것이므로 2단계(진행중)로 표시한다.
 * - returned: 취소·환불 안내 / manual_review·failed: 문의 안내
 */
export function resolveTrackView(
  status: FulfillmentStatus,
  completedAt: string | null,
): TrackView {
  switch (status) {
    case 'pending':
      return { kind: 'step', step: 1, done: false }
    case 'in_progress':
      return { kind: 'step', step: 2, done: false }
    case 'completed':
    case 'purchase_decided':
      return completedAt
        ? { kind: 'step', step: 3, done: true }
        : { kind: 'step', step: 2, done: false }
    case 'returned':
      return { kind: 'cancelled' }
    case 'manual_review':
    case 'failed':
      return { kind: 'inquiry' }
  }
}
