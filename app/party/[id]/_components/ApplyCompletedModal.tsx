'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { KAKAO_CHAT_URL } from '@/constants/app'

type ApplyCompletedModalProps = {
  isOpen: boolean
  onClose: () => void
  price: number
  fee: number
  totalAmount: number
}

export function ApplyCompletedModal({
  isOpen,
  onClose,
  price,
  fee,
  totalAmount,
}: ApplyCompletedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="참여 신청이 완료되었습니다">
      <div className="space-y-4">
        <p className="text-body-md text-text-secondary">
          아래 카카오 채널로 결제 안내를 받아주세요.
          <br />
          입금 확인 후 관리자가 승인하면 파티 참여가 최종 확정됩니다.
        </p>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
          <div>
            <p className="text-caption-md text-text-muted">가격</p>
            <p className="text-body-md font-semibold text-text-primary">
              {price.toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-caption-md text-text-muted">수수료</p>
            <p className="text-body-md font-semibold text-text-primary">
              {fee.toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-caption-md text-text-muted">합계</p>
            <p className="text-body-md font-semibold text-brand">
              {totalAmount.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-gray-50 p-3">
          <p className="text-body-md font-semibold text-text-primary">
            결제 및 상담 시간: <span className="text-brand">매일 오전 10:00 ~ 다음날 새벽 02:00</span>
          </p>
          <p className="text-caption-md text-text-muted">
            상담 시간 외에도 담당자가 확인하는 대로 최대한 빠르게 처리해 드리니 편하게 문의 남겨주세요!
          </p>
        </div>

        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="primary" className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90">
            카카오 채널로 결제하기
          </Button>
        </a>
      </div>
    </Modal>
  )
}
