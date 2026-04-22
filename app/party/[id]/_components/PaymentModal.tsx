'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { OwnProduct } from '@/types/domain'
import type { PayMethod } from '@/constants/app'
import { PayMethodSelector } from './PayMethodSelector'

const FEE_RATE = 0.1

type PaymentModalProps = {
  isOpen: boolean
  onClose: () => void
  product: OwnProduct
  onPay: (payMethod: PayMethod) => void
  isSubmitting: boolean
}

export function PaymentModal({
  isOpen,
  onClose,
  product,
  onPay,
  isSubmitting,
}: PaymentModalProps) {
  const [payMethod, setPayMethod] = useState<PayMethod>('kakaopay')
  const displayPrice = product.currentPrice ?? product.price
  const fee = Math.round(displayPrice * FEE_RATE)
  const totalAmount = displayPrice + fee
  const isDiscounted = displayPrice < product.price

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="파티 참여 결제"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button variant="primary" onClick={() => onPay(payMethod)} loading={isSubmitting}>
            {totalAmount.toLocaleString()}원 결제하기
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

        {/* 결제 수단 */}
        <div className="space-y-2">
          <p className="text-body-md font-medium text-text-primary">결제 수단 선택</p>
          <PayMethodSelector value={payMethod} onChange={setPayMethod} disabled={isSubmitting} />
        </div>

        <div className="space-y-1">
          <p className="text-body-sm text-text-muted">
            테스트 모드로 운영 중입니다. 실제 금액이 청구되지 않습니다.
          </p>
          <p className="text-body-sm text-text-muted">
            결제 관련 문의는 고객센터로 연락해 주세요.
          </p>
        </div>
      </div>
    </Modal>
  )
}
