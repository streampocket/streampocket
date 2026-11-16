'use client'

import { useEffect, useRef, useState } from 'react'
import { CopyTextButton } from '@/components/CopyTextButton'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PARTY_TYPE_META } from '@/constants/app'
import { useNewRequestAlert } from '@/hooks/useNewRequestAlert'
import {
  useOtpResetRequests,
  useResetOtpFromRequest,
  type OtpResetRequest,
} from '@/hooks/useOtpResetRequests'
import { cn, formatDate } from '@/lib/utils'

type NotificationState = NotificationPermission | 'unsupported'

function readNotificationState(): NotificationState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}

const RESET_CONFIRM_MESSAGE = '발급 횟수를 초기화하시겠습니까?\n구매자에게 다시 3회가 부여됩니다. (발급 로그는 유지)'

/**
 * 관리자 상단 종 — 구매자 OTP 재발급 요청 중 아직 초기화하지 않은 건.
 * 주문을 검색하지 않고 여기서 바로 초기화한다 (주문관리 OTP 탭과 같은 API).
 * 주문 관리 권한이 있을 때만 렌더한다 (TopBar에서 판단).
 */
export function OtpResetRequestBell() {
  const { data: requests } = useOtpResetRequests(true)
  const resetMutation = useResetOtpFromRequest()
  const [open, setOpen] = useState(false)
  const [notificationState, setNotificationState] = useState<NotificationState>('unsupported')
  const containerRef = useRef<HTMLDivElement>(null)

  useNewRequestAlert(requests)

  // Notification은 브라우저에만 있으므로 마운트 후에 읽는다 (SSR 불일치 방지)
  useEffect(() => {
    setNotificationState(readNotificationState())
  }, [])

  // 바깥 클릭·Esc로 닫기
  useEffect(() => {
    if (!open) return
    const handleMouseDown = (event: MouseEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const count = requests?.length ?? 0

  const enableNotification = async () => {
    if (notificationState === 'unsupported') return
    const result = await Notification.requestPermission()
    setNotificationState(result)
  }

  const handleReset = (request: OtpResetRequest) => {
    if (!request.orderId) return
    if (!window.confirm(RESET_CONFIRM_MESSAGE)) return
    resetMutation.mutate(request.orderId)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`OTP 재발급 요청 ${count}건`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-gray-100"
      >
        <span aria-hidden>🔔</span>
        {count > 0 && (
          <span className="text-caption-sm absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 font-semibold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card-bg shadow-lg">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="text-body-md font-semibold text-text-primary">OTP 재발급 요청 ({count})</p>
            {notificationState === 'default' && (
              <Button size="xs" variant="secondary" onClick={enableNotification}>
                PC 알림 켜기
              </Button>
            )}
            {notificationState === 'denied' && (
              <span className="text-caption-sm text-text-muted">브라우저에서 알림이 차단됨</span>
            )}
          </div>

          {count === 0 ? (
            <p className="text-body-md px-4 py-8 text-center text-text-muted">
              처리할 재발급 요청이 없습니다.
            </p>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto">
              {requests?.map((request) => {
                const meta = PARTY_TYPE_META[request.partyType]
                const isResetting =
                  resetMutation.isPending && resetMutation.variables === request.orderId
                return (
                  <li key={request.applicationId} className="space-y-1.5 px-4 py-3">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <span className="text-body-md min-w-0 break-words font-medium text-text-primary">
                        {request.productName}
                      </span>
                    </div>
                    <p className="text-caption-md text-text-secondary">
                      {request.userName ?? '(알 수 없음)'} · {request.userPhone ?? '-'}
                    </p>
                    <p className="text-caption-sm text-text-muted">
                      요청 {formatDate(request.requestedAt)} · 만료 {formatDate(request.expiresAt)}
                    </p>
                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-0.5">
                      {request.productOrderId ? (
                        <CopyTextButton
                          label="주문번호 복사"
                          copiedLabel={`주문번호 ${request.productOrderId}`}
                          getText={() => request.productOrderId ?? ''}
                        />
                      ) : (
                        <span className="text-caption-sm mr-auto text-text-muted">
                          연결 주문 없음 — 주문관리에서 처리
                        </span>
                      )}
                      <Button
                        size="sm"
                        disabled={!request.orderId || resetMutation.isPending}
                        onClick={() => handleReset(request)}
                        className={cn(isResetting && 'opacity-70')}
                      >
                        {isResetting ? '초기화 중...' : '횟수 초기화'}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
