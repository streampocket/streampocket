'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { OwnProduct } from '@/types/domain'

const FEE_RATE = 0.1

type PaymentModalProps = {
  isOpen: boolean
  onClose: () => void
  product: OwnProduct
  onSubmit: () => void
  isSubmitting: boolean
}

export function PaymentModal({
  isOpen,
  onClose,
  product,
  onSubmit,
  isSubmitting,
}: PaymentModalProps) {
  const displayPrice = product.currentPrice ?? product.price
  const fee = Math.round(displayPrice * FEE_RATE)
  const totalAmount = displayPrice + fee
  const isDiscounted = displayPrice < product.price

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="파티 참여 신청"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button variant="primary" onClick={onSubmit} loading={isSubmitting}>
            신청하기
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 결제 정보 테이블 */}
        <div className="divide-y divide-border rounded-lg border border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-md text-text-secondary">파티명</span>
            <span className="text-body-md font-medium text-text-primary">{product.name}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-md text-text-secondary">
              {product.startedAt ? '남은 기간' : '사용기간'}
            </span>
            <span className="text-body-md font-medium text-text-primary">
              {product.startedAt ? `${product.remainingDays}일` : `${product.durationDays}일`}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-md text-text-secondary">가격</span>
            <span className="text-body-md font-medium text-text-primary">
              {isDiscounted && (
                <span className="mr-1 text-text-muted line-through">{product.price.toLocaleString()}원</span>
              )}
              {displayPrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-body-md text-text-secondary">수수료(10%)</span>
            <span className="text-body-md font-medium text-text-primary">{fee.toLocaleString()}원</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
            <span className="text-body-lg font-semibold text-text-primary">합계</span>
            <span className="text-body-lg font-bold text-brand">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="rounded-lg bg-yellow-50 p-3">
          <p className="text-body-sm text-yellow-800">
            현재 결제 시스템 준비 중입니다. 신청 완료 후 관리자가 연락드리겠습니다.
          </p>
        </div>
      </div>
    </Modal>
  )
}
