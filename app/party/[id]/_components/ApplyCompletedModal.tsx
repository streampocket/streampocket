'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { KAKAO_CHAT_URL } from '@/constants/app'
import { formatPoint, formatWon, payableAmount } from '@/lib/points'

type ApplyCompletedModalProps = {
  isOpen: boolean
  onClose: () => void
  price: number
  fee: number
  totalAmount: number
  usedPoint: number
}

export function ApplyCompletedModal({
  isOpen,
  onClose,
  price,
  fee,
  totalAmount,
  usedPoint,
}: ApplyCompletedModalProps) {
  const payable = payableAmount(totalAmount, usedPoint)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="참여 신청이 완료되었습니다">
      <div className="space-y-4">
        <p className="text-body-md text-text-secondary">
          아래 카카오 채널로 결제 안내를 받아주세요.
          <br />
          입금 확인 후 관리자가 승인하면 파티 참여가 최종 확정됩니다.
          <br />
          승인 완료 후 마이페이지 &gt; 구매 내역에서 OTP를 발급받을 수 있습니다.
        </p>

        <div className="space-y-1.5 rounded-lg bg-gray-50 p-3">
          <div className="flex justify-between text-body-md text-text-secondary">
            <span>가격</span>
            <span>{formatWon(price)}</span>
          </div>
          <div className="flex justify-between text-body-md text-text-secondary">
            <span>수수료</span>
            <span>{formatWon(fee)}</span>
          </div>
          {/* 포인트를 쓴 건에만 줄을 추가한다 — 안 쓴 신청에 "-0P"가 붙으면 읽는 데 방해만 된다 */}
          {usedPoint > 0 && (
            <div className="flex justify-between text-body-md text-text-secondary">
              <span>포인트 사용</span>
              <span className="text-brand">-{formatPoint(usedPoint)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-1.5 text-body-md font-bold text-text-primary">
            <span>결제 금액</span>
            <span className="text-brand">{formatWon(payable)}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-gray-50 p-3">
          <p className="text-body-md font-semibold text-text-primary">
            결제 및 상담 시간: <span className="text-brand">매일 오전 10:00 ~ 다음날 새벽 01:00</span>
          </p>
          <p className="text-caption-md text-text-muted">
            상담 시간 외에도 담당자가 확인하는 대로 최대한 빠르게 처리해 드리니 편하게 문의 남겨주세요!
          </p>
        </div>

        {/* 레이블이 길어 2줄이 될 수 있어 두 버튼 모두 높이 auto + 최소높이로 맞춘다 */}
        <div className="grid grid-cols-2 items-stretch gap-2">
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {/* cn이 tailwind-merge가 아니라 variant의 bg-brand·h-9와 클래스 충돌 → 인라인 스타일로 강제 */}
            <Button
              variant="primary"
              className="w-full whitespace-normal py-1.5 leading-tight hover:opacity-90"
              style={{
                backgroundColor: '#FEE500',
                color: '#191919',
                height: 'auto',
                minHeight: '2.25rem',
              }}
            >
              카카오톡 상담 (결제하러 가기)
            </Button>
          </a>
          {/* 닫기(onClose)가 마이페이지 구매내역 이동을 담당 — 버튼은 모달만 닫으면 됨 */}
          <Button
            variant="primary"
            className="w-full whitespace-normal py-1.5 leading-tight"
            style={{ height: 'auto', minHeight: '2.25rem' }}
            onClick={onClose}
          >
            마이페이지로 이동
          </Button>
        </div>
      </div>
    </Modal>
  )
}
