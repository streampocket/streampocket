'use client'

import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useMyApplications } from '../_hooks/useMyApplications'
import { OtpIssuePanel } from './OtpIssuePanel'
import { formatPoint, formatWon, payableAmount } from '@/lib/points'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { MyApplication } from '../_types'

const APPLICATION_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: '대기중', variant: 'yellow' },
  confirmed: { label: '확정', variant: 'green' },
  cancelled: { label: '취소', variant: 'red' },
  expired: { label: '기간 만료', variant: 'gray' },
}

export function PurchaseHistory() {
  const { data: applications, isLoading, error } = useMyApplications()

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
    <div className="mx-auto max-w-2xl space-y-4">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  )
}

type ApplicationCardProps = {
  application: MyApplication
}

function ApplicationCard({ application }: ApplicationCardProps) {
  const appStatus = APPLICATION_STATUS_MAP[application.status]
  // OTP 발급은 승인 완료 + 이용 기간 중인 신청만 가능
  const otpAvailable =
    application.status === 'confirmed' &&
    application.expiresAt !== null &&
    new Date(application.expiresAt).getTime() > Date.now()

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
              <p className="text-caption-md text-text-muted">
                {application.usedPoint > 0 ? '결제 금액' : '합계'}
              </p>
              <p className="text-body-md font-semibold text-brand">
                {formatWon(payableAmount(application.totalAmount, application.usedPoint))}
              </p>
              {/* 포인트를 쓴 건에만 근거를 덧붙인다 */}
              {application.usedPoint > 0 && (
                <p className="text-caption-md text-text-muted">
                  포인트 -{formatPoint(application.usedPoint)}
                </p>
              )}
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

          {/* OTP 발급 */}
          {otpAvailable && (
            <OtpIssuePanel
              applicationId={application.id}
              otpRegistered={application.otpRegistered}
              otpIssueCount={application.otpIssueCount}
            />
          )}

          {/* 하단: 신청일 */}
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
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
