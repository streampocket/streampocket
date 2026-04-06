'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useApplyPartner } from '../_hooks/useApplyPartner'

const BANK_OPTIONS = [
  '카카오뱅크',
  '토스뱅크',
  '국민은행',
  '신한은행',
  '하나은행',
  '우리은행',
  '농협은행',
  'SC제일은행',
  '기업은행',
  '대구은행',
  '부산은행',
  '경남은행',
  '광주은행',
  '전북은행',
  '제주은행',
  '수협은행',
  '우체국',
  '새마을금고',
  '신협',
] as const // 단언 사유: 은행 목록 리터럴 고정

type PartnerApplyModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function PartnerApplyModal({ isOpen, onClose }: PartnerApplyModalProps) {
  const { data: profile } = useUserProfile()
  const applyMutation = useApplyPartner()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (profile) {
      setName((prev) => prev || profile.name)
      setPhone((prev) => prev || profile.phone)
    }
  }, [profile])

  const canSubmit = name.trim() && phone.trim() && bankName && bankAccount.trim() && agreed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    applyMutation.mutate(
      {
        name: name.trim(),
        phone: phone.trim(),
        bankName,
        bankAccount: bankAccount.trim(),
        agreedToTerms: true,
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="파트너 신청">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이름 */}
        <div>
          <label className="text-body-md mb-1.5 block font-medium text-text-primary">
            이름 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            required
            className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="text-body-md mb-1.5 block font-medium text-text-primary">
            연락처 <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            readOnly
            required
            className="text-body-md w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-text-muted outline-none"
          />
        </div>

        {/* 은행 */}
        <div>
          <label className="text-body-md mb-1.5 block font-medium text-text-primary">
            은행 <span className="text-danger">*</span>
          </label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="">은행 선택</option>
            {BANK_OPTIONS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* 계좌번호 */}
        <div>
          <label className="text-body-md mb-1.5 block font-medium text-text-primary">
            계좌번호 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="계좌번호 입력"
            required
            className="text-body-md w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* 주의사항 */}
        <div className="max-h-60 overflow-y-auto rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-caption-md mb-2 font-semibold text-yellow-800">주의사항</p>
          <div className="text-caption-sm space-y-3 text-yellow-700">
            <p>
              안전한 서비스 이용을 위해 파티의 운영 및 관리 권한은 파티장님께 부여됩니다.
              파티 운영 중 발생하는 이슈는 파티장님께서 주도적으로 확인해 주셔야 합니다.
              멤버와의 소통은 파티원 권리보호를 위해 플랫폼 중재하에 이뤄집니다.
            </p>
            <p>
              파티장님은 모집 시 약속한 기간 동안 파티원들이 원활하게 서비스를 이용할 수 있도록
              파티를 유지해 주셔야 합니다. 신뢰를 바탕으로 한 건강한 공유 문화를 위해,
              기간 미준수 등으로 발생하는 이슈는 파티장님의 적극적인 관리가 필요합니다.
            </p>
            <p>
              플랫폼 운영 및 안전 거래 시스템 제공을 위해 매칭 성공 시 이용료의 10%가
              수수료로 발생합니다. 정산 시 수수료를 제한 금액으로 정산됩니다.
            </p>
            <p>
              정산금은 등록하신 계좌로 안전하게 입금됩니다. 본인인증 성함과
              예금주명이 일치해야 입금이 가능합니다.
            </p>
            <p>
              OTTALL은 파티장과 멤버를 연결하는 통신판매 중개 플랫폼으로서, 모두가 만족할 수 있는
              최적의 거래 환경을 제공하기 위해 최선을 다합니다. 개별 파티에서 발생하는 직접적인
              거래 계약의 주체는 파티 구성원임을 안내드립니다.
            </p>

            <p className="font-semibold text-yellow-800">1. 파티 시작 전 100% 환불 (청약철회)</p>
            <p>
              멤버가 결제를 완료했더라도 마이페이지에서 계정 정보(아이디/비번)를 확인하기 전이라면,
              결제 후 7일 이내에 언제든 환불이 가능합니다. 이 경우 파티 매칭은 취소되며
              별도의 정산은 발생하지 않습니다.
            </p>

            <p className="font-semibold text-yellow-800">2. 파티장의 신속한 정보 제공 의무</p>
            <p>
              6시간 이내 매칭 보장: 영업시간(10:30~23:30) 기준, 결제 후 6시간 이내에 멤버에게
              이용 환경이 제공되지 않아 멤버가 요청할 경우 100% 전액 환불됩니다.
              원활한 정산을 위해 파티 모집 시 계정 정보를 정확히 등록해 주세요.
            </p>
            <p>
              30일 내 6시간 이내 매칭이 3회 이상 실패할 경우 원활한 매칭을 위하여
              사안에 따라 파티장 권한이 박탈될 수 있습니다.
            </p>

            <p className="font-semibold text-yellow-800">3. 서비스 장애 발생 시 조치 가이드</p>
            <p>
              12시간 내 복구 원칙: 계정 막힘 등 이슈 발생 시 12시간 이내에 정상화해주셔야 합니다.
            </p>
            <p>
              보상 제도: 복구에 12시간 이상 소요될 경우, 멤버에게는 장애 시간의 1.5배만큼
              이용 기간이 연장됩니다. (해당 기간만큼 파티장님의 정산 주기도 조정될 수 있습니다.)
            </p>
            <p>
              일할 환불: 만약 OTT 플랫폼의 정책 변경 등으로 파티 유지가 불가능해지면,
              이미 이용한 날짜를 제외한 잔여 기간만큼 일할 계산하여 멤버에게 환불됩니다.
            </p>

            <p className="font-semibold text-yellow-800">4. 파티장님을 보호합니다 (멤버 귀책사유)</p>
            <p>
              파티원이 비밀번호를 임의로 변경하거나 프로필을 삭제하는 등 규정을 위반하여
              발생한 문제에 대해서는 환불이 제한됩니다.
            </p>
            <p>
              특히 파티원의 고의적인 방해 행위로 파티 운영에 손해가 발생한 경우,
              플랫폼은 해당 파티원에게 손해배상을 청구하는 등 파티장님의 권리를 보호하기 위해
              적극 대응합니다.
            </p>

            <p className="font-semibold text-yellow-800">5. 정직하고 투명한 환불 프로세스</p>
            <p>
              단순 변심이나 파티장의 귀책이 없는 경우에도 관련 법령에 따라 환불이 진행될 수 있습니다.
              OTTALL은 환불 시 멤버에게 불필요한 위약금을 부과하지 않으며, 파티장님께도 실제 이용 기간에
              대한 합리적인 정산이 이루어지도록 중재합니다.
            </p>
          </div>
        </div>

        {/* 동의 체크박스 */}
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-brand"
          />
          <span className="text-caption-md text-text-secondary">
            서비스 제공자의 가입약관과 상기 정보 제공에 동의합니다.
          </span>
        </label>

        {/* 신청 버튼 */}
        <Button
          type="submit"
          variant="primary"
          loading={applyMutation.isPending}
          disabled={!canSubmit}
          className="w-full"
        >
          파트너 신청
        </Button>
      </form>
    </Modal>
  )
}
