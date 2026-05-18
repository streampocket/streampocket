'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { RegistrationEditFields } from '@/components/registration/RegistrationEditFields'
import { useRegistrationDetail } from '../_hooks/useRegistrationDetail'
import { useUnlinkOrder } from '../_hooks/useUnlinkOrder'
import { OrderLinkModal } from './OrderLinkModal'

type RegistrationDetailModalProps = {
  registrationId: string | null
  onClose: () => void
}

export function RegistrationDetailModal({
  registrationId,
  onClose,
}: RegistrationDetailModalProps) {
  const { data: registration, isLoading } = useRegistrationDetail(registrationId)
  const { mutate: unlink, isPending: isUnlinking } = useUnlinkOrder()
  const [isLinkOpen, setIsLinkOpen] = useState(false)

  return (
    <Modal isOpen={registrationId !== null} onClose={onClose} title="스팀 등록 접수 상세">
      {isLoading ? (
        <p className="py-8 text-center text-caption-md text-text-muted">로딩 중...</p>
      ) : registration ? (
        <div className="space-y-4">
          {/* 주문 연결 영역 */}
          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-caption-md font-semibold text-text-primary">연결된 주문</p>
            {registration.orderItem ? (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-body-md text-text-primary">
                    {registration.orderItem.productName}
                  </p>
                  <p className="text-caption-sm text-text-muted">
                    상품주문번호 {registration.orderItem.productOrderId}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={isUnlinking}
                  onClick={() => {
                    if (window.confirm('이 주문과의 연결을 해제하시겠습니까?')) {
                      unlink(registration.id)
                    }
                  }}
                >
                  연결 해제
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <p className="text-caption-md text-text-muted">연결된 주문이 없습니다.</p>
                <Button size="sm" variant="primary" onClick={() => setIsLinkOpen(true)}>
                  주문 연결
                </Button>
              </div>
            )}
          </div>

          <RegistrationEditFields registration={registration} />

          {isLinkOpen && (
            <OrderLinkModal
              registrationId={registration.id}
              defaultSearch={registration.buyerName ?? ''}
              onClose={() => setIsLinkOpen(false)}
            />
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-caption-md text-text-muted">
          접수 정보를 불러올 수 없습니다.
        </p>
      )}
    </Modal>
  )
}
