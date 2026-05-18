'use client'

import { RegistrationEditFields } from '@/components/registration/RegistrationEditFields'
import { useOrderRegistration } from '../_hooks/useOrderRegistration'

// 주문 상세 모달의 "스팀 등록 접수" 섹션 — 연결된 접수가 있으면 편집 폼을 보여준다.
export function SteamRegistrationSection({ orderId }: { orderId: string }) {
  const { data: registration, isLoading } = useOrderRegistration(orderId)

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-surface-secondary p-3">
        <p className="text-caption-md text-text-muted">스팀 등록 접수 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="rounded-lg border border-border bg-surface-secondary p-3">
        <p className="text-caption-md font-semibold text-text-primary">스팀 등록 접수</p>
        <p className="mt-1 text-caption-md text-text-muted">
          연결된 스팀 등록 접수가 없습니다. (챗봇 미접수 또는 미연결)
        </p>
      </div>
    )
  }

  return <RegistrationEditFields registration={registration} />
}
