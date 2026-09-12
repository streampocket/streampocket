import type {
  PartyApplicationStatus,
  PartyType,
  PartyDurationMode,
  PartyAccountCredentials,
  DramaAccountMemo,
} from '@/types/domain'

export type ApplicationTabStatus = PartyApplicationStatus | 'all'

export type AdminApplicationListItem = {
  id: string
  status: PartyApplicationStatus
  price: number
  fee: number
  totalAmount: number
  /** 신청 시점에 차감한 포인트. 실제 받은 돈은 totalAmount - usedPoint */
  usedPoint: number
  startedAt: string | null
  expiresAt: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
  product: {
    id: string
    name: string
    durationDays: number
    partyType: PartyType
    durationMode: PartyDurationMode
    category: { id: string; name: string }
  }
}

export type AdminAlimtalkLog = {
  id: string
  status: 'queued' | 'sent' | 'failed'
  templateCode: string | null
  errorMessage: string | null
  sentAt: string | null
  createdAt: string
}

/** 자동 배정이 막히는 이유 — 승인 모달이 토글 옆에 사유로 보여준다 */
export type AutoAssignReason =
  | 'not_found'
  | 'not_confirmed'
  | 'already_assigned'
  /** 동시에 배정한 다른 관리자가 먼저 커밋 — 새로고침하면 배정된 상태로 보인다 */
  | 'assigned_by_other'
  | 'already_has_secret'
  | 'unmapped_party'
  | 'no_account'

/** 승인 시 배정될 계정 후보 — 아이디·비밀번호·OTP 시크릿 평문 포함 (관리자 전용) */
export type AssignedDramaAccount = {
  id: string
  email: string
  password: string
  otpSecret: string
  platform: string | null
  /** 'YYYY-MM-DD' */
  dueAt: string | null
  /**
   * 서버가 미리보기 시점에 센 빈자리.
   * 화면에 숫자로 그리지 않는다 — 메모의 `(빈자리)` 줄이 같은 정보를 보여주는데,
   * 둘은 기준 시각이 달라(서버 응답 시점 vs 렌더 시점) 숫자가 엇갈릴 수 있다.
   */
  freeSlots: number
  /** 메모 원문을 그리는 데 쓰는 계정 상태 (파티원 목록 포함) */
  memo: DramaAccountMemo | null
}

/**
 * 승인 전 미리보기 — "지금 승인하면 어떤 계정이 배정되는지".
 * 예약이 아니라 조회할 때마다 다시 계산되는 값이라, 승인 시점에 다른 계정이 될 수 있다.
 */
export type AutoAssignPreview = {
  eligible: boolean
  reason: AutoAssignReason | null
  account: AssignedDramaAccount | null
}

export type AdminApplicationDetail = AdminApplicationListItem & {
  product: AdminApplicationListItem['product'] & {
    totalSlots: number
    filledSlots: number
    /** 파티 시작(첫 승인) 시각. 아직 아무도 승인되지 않았으면 null */
    startedAt: string | null
    /**
     * 파티 자체가 끝나는 시각 — 신청자 개인 만료(expiresAt)와 다른 값이다.
     * 파티 관리 화면과 같은 이름·계산식(be에서 계산). 시작 전이면 null
     */
    partyExpiresAt: string | null
    /** 파티 종료까지 남은 일수. 시작 전이면 파티 전체 이용일수 */
    partyRemainingDays: number
  }
  /** 신청 접수 알림톡(UJ_2053) 발송 이력 */
  alimtalkLogs: AdminAlimtalkLog[]
  autoAssignPreview: AutoAssignPreview
  /** 시크릿이 등록된 건에만 채워진다. 수동 등록 건은 시크릿으로 역추적한 결과 */
  dramaAccount: PartyAccountCredentials | null
  /**
   * 대기 건에만 채워진다 — 지금 승인하면 이용이 언제 끝나는지.
   * 승인 로직과 같은 계산식이라 실제 승인 시 저장될 값과 일치한다.
   * 확정 건은 저장된 expiresAt이 답이라 null이다.
   */
  expiresAtIfApprovedNow: string | null
}

export type AdminApplicationListParams = {
  status?: PartyApplicationStatus
  search?: string
  page?: number
  pageSize?: number
}
