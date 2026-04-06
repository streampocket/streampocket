'use client'

import { useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useMyPartner } from '../_hooks/useMyPartner'
import { PartnerApplyModal } from './PartnerApplyModal'

type PartnerStatusGuardProps = {
  children: React.ReactNode
}

export function PartnerStatusGuard({ children }: PartnerStatusGuardProps) {
  const { data: partner, isLoading } = useMyPartner()
  const [showModal, setShowModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-body-md text-text-muted">파트너 상태를 확인하는 중입니다...</p>
      </div>
    )
  }

  // 파트너가 아닌 경우
  if (!partner) {
    return (
      <>
        <Card className="mx-auto max-w-md text-center">
          <CardBody className="space-y-4 py-10">
            <p className="text-heading-md text-text-primary">파트너 등록이 필요합니다</p>
            <p className="text-body-md text-text-secondary">
              상품을 등록하려면 먼저 파트너 신청을 해주세요.
            </p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              파트너 신청하기
            </Button>
          </CardBody>
        </Card>
        <PartnerApplyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    )
  }

  // 승인 대기 중
  if (partner.status === 'pending') {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardBody className="space-y-3 py-10">
          <p className="text-heading-md text-text-primary">파트너 신청 검토 중</p>
          <p className="text-body-md text-text-secondary">
            파트너 신청이 관리자에게 전달되었습니다.
            <br />
            승인 후 상품 등록이 가능합니다.
          </p>
        </CardBody>
      </Card>
    )
  }

  // 거절됨
  if (partner.status === 'rejected') {
    const canReapply = partner.rejectedAt
      ? Date.now() - new Date(partner.rejectedAt).getTime() >= 14 * 24 * 60 * 60 * 1000
      : true

    if (canReapply) {
      return (
        <>
          <Card className="mx-auto max-w-md text-center">
            <CardBody className="space-y-4 py-10">
              <p className="text-heading-md text-text-primary">파트너 신청이 거절되었습니다</p>
              {partner.rejectionNote && (
                <p className="text-body-md text-text-secondary">
                  사유: {partner.rejectionNote}
                </p>
              )}
              <p className="text-body-md text-text-secondary">재신청이 가능합니다.</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                파트너 재신청하기
              </Button>
            </CardBody>
          </Card>
          <PartnerApplyModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
      )
    }

    const retryDate = new Date(partner.rejectedAt!)
    retryDate.setDate(retryDate.getDate() + 14)

    return (
      <Card className="mx-auto max-w-md text-center">
        <CardBody className="space-y-3 py-10">
          <p className="text-heading-md text-text-primary">파트너 신청이 거절되었습니다</p>
          {partner.rejectionNote && (
            <p className="text-body-md text-text-secondary">
              사유: {partner.rejectionNote}
            </p>
          )}
          <p className="text-body-md text-text-secondary">
            {retryDate.toLocaleDateString('ko-KR')}부터 재신청 가능합니다.
          </p>
        </CardBody>
      </Card>
    )
  }

  // approved — 상품 등록 폼 표시
  return <>{children}</>
}
