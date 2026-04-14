'use client'

import { useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useMyApplications } from '../_hooks/useMyApplications'
import { CredentialsModal } from './CredentialsModal'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { MyApplication } from '../_types'

const APPLICATION_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: '대기중', variant: 'yellow' },
  confirmed: { label: '확정', variant: 'green' },
  cancelled: { label: '취소', variant: 'red' },
  expired: { label: '기간 만료', variant: 'gray' },
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: '결제 대기', variant: 'yellow' },
  paid: { label: '결제 완료', variant: 'green' },
  cancelled: { label: '결제 취소', variant: 'red' },
}

export function PurchaseHistory() {
  const { data: applications, isLoading, error } = useMyApplications()
  const [credentialTarget, setCredentialTarget] = useState<{
    applicationId: string
    productName: string
  } | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-body-md text-text-secondary">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-body-md text-red-500">구매 내역을 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-body-md text-text-muted">구매 내역이 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-4">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onViewCredentials={() =>
              setCredentialTarget({
                applicationId: app.id,
                productName: app.product.name,
              })
            }
          />
        ))}
      </div>

      <CredentialsModal
        applicationId={credentialTarget?.applicationId ?? null}
        productName={credentialTarget?.productName ?? ''}
        isOpen={!!credentialTarget}
        onClose={() => setCredentialTarget(null)}
      />
    </>
  )
}

type ApplicationCardProps = {
  application: MyApplication
  onViewCredentials: () => void
}

function ApplicationCard({ application, onViewCredentials }: ApplicationCardProps) {
  const appStatus = APPLICATION_STATUS_MAP[application.status]
  const latestPayment = application.payments[0]
  const paymentStatus = latestPayment
    ? PAYMENT_STATUS_MAP[latestPayment.status]
    : null

  return (
    <Card>
      <CardBody>
        <div className="space-y-3">
          {/* 상품명 + 카테고리 */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-body-lg font-semibold text-text-primary">
                {application.product.name}
              </p>
              <p className="text-caption-md text-text-muted">
                {application.product.category.name} · {application.product.durationDays}일
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {appStatus && <Badge variant={appStatus.variant}>{appStatus.label}</Badge>}
              {paymentStatus && (
                <Badge variant={paymentStatus.variant}>{paymentStatus.label}</Badge>
              )}
            </div>
          </div>

          {/* 금액 정보 */}
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
            <div>
              <p className="text-caption-md text-text-muted">가격</p>
              <p className="text-body-md font-semibold text-text-primary">
                {application.price.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-caption-md text-text-muted">수수료</p>
              <p className="text-body-md font-semibold text-text-primary">
                {application.fee.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-caption-md text-text-muted">합계</p>
              <p className="text-body-md font-semibold text-brand">
                {application.totalAmount.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 이용 기간 */}
          {application.startedAt && application.expiresAt && (
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <span className="text-caption-md text-text-muted">이용 기간</span>
              <span className="text-caption-md text-text-secondary">
                {new Date(application.startedAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })} ~ {new Date(application.expiresAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </span>
            </div>
          )}

          {/* 하단: 신청일 + 계정정보 버튼 */}
          <div className="flex items-center justify-between">
            <p className="text-caption-md text-text-muted">
              {new Date(application.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Seoul',
              })}
            </p>
            {application.status === 'expired' && (
              <span className="text-caption-md text-text-muted">기간 만료</span>
            )}
            {application.status === 'confirmed' && (
              <Button variant="primary" size="sm" onClick={onViewCredentials}>
                계정 정보 보기
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
