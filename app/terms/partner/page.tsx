import type { Metadata } from 'next'
import { LANDING_NAV_ITEMS } from '@/app/(landing)/_data'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

export const metadata: Metadata = {
  title: '파트너(판매자) 이용약관 및 운영 정책',
  description: '스트림포켓 파트너(판매자) 이용약관 및 운영 정책',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PartnerTermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader navItems={LANDING_NAV_ITEMS} />

      <section className="mx-auto max-w-[800px] px-5 py-12 sm:px-8">
        <h1 className="mb-8 text-2xl font-bold text-text-primary">
          파트너(판매자) 이용약관 및 운영 정책
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-text-secondary">
          본 약관은 중개 플랫폼(이하 &quot;회사&quot;)과 계정 공유 환경을 제공하는
          파트너(이하 &quot;판매자&quot;) 간의 권리와 의무를 규정합니다. 판매자는 본
          약관을 준수함으로써 플랫폼 내에서 활동할 수 있습니다.
        </p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제1조 (판매자의 의무 및 계정 관리)
            </h2>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                <strong>정상 계정 유지:</strong> 판매자는 결제된 기간 동안 중단 없이
                이용 가능한 정식 구독 계정을 제공해야 합니다.
              </li>
              <li>
                <strong>정보 제공 의무:</strong> 판매자는 매칭 성공 시 6시간
                이내(영업시간 기준)에 정확한 접속 정보를 플랫폼에 전달해야 합니다.
              </li>
              <li>
                <strong>독점적 공급:</strong> 플랫폼을 통해 매칭된 프로필은 해당
                구매자 1인에게만 독점적으로 제공되어야 하며, 타 플랫폼에 중복
                판매하거나 임의로 제3자에게 공유할 수 없습니다. (1인 1프로필 원칙)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제2조 (장애 대응 및 보상 책임)
            </h2>
            <p className="mb-3">
              판매자는 소비자 이용약관에 명시된 서비스 수준(SLA)을 준수해야 하며,
              장애 발생 시 다음과 같은 책임을 집니다.
            </p>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                <strong>신속 복구 의무:</strong> 계정 정지, 비밀번호 오류 등 장애
                발생 통보를 받은 후 12시간 이내에 정상화된 계정 정보를 재공급해야
                합니다.
              </li>
              <li>
                <strong>지연 보상 책임:</strong> 장애 복구가 12시간 이상 지연되어
                소비자에게 &apos;이용 기간 1.5배 연장&apos; 혜택이 제공될 경우, 해당
                연장에 발생하는 비용(계정 유지비 등)은 판매자가 전액 부담합니다.
              </li>
              <li>
                <strong>계정 교체:</strong> 기존 계정의 복구가 불가능하다고 판단될
                경우, 판매자는 지체 없이 새로운 계정으로 교체하여 서비스를 지속해야
                합니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제3조 (환불 정산 및 위약금)
            </h2>
            <p className="mb-3">
              소비자 이용약관 제3조 및 제6조에 따른 환불 발생 시 정산 기준은 다음과
              같습니다.
            </p>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                <strong>판매자 귀책 환불:</strong> 판매자의 계정 관리 소홀, 중도
                해지, 정보 미제공으로 인해 소비자에게 일할 환불 또는 전액 환불이
                진행될 경우, 해당 환불 금액은 판매자에게 정산되지 않으며 이미 정산된
                경우 차기 정산액에서 차감합니다.
              </li>
              <li>
                <strong>배송 지연 위약:</strong> 제1조 3항에 따른 배송 지연(6시간
                초과)으로 전액 환불이 발생할 경우, 해당 건에 대한 플랫폼 중개 수수료
                상당액을 판매자에게 청구할 수 있습니다.
              </li>
              <li>
                <strong>중도 이탈 방지:</strong> 판매자가 계약 기간 중 임의로 계정
                구독을 해지하여 단체 환불 사태를 유발할 경우, 회사는 판매자의 잔여
                정산금을 동결하고 영업방해에 따른 손해배상을 청구할 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제4조 (정산 주기 및 방식)
            </h2>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                <strong>정산 신청 시점:</strong> 판매한 상품의 이용 기간이
                정상적으로 종료된 날로부터 영업일 기준 2일(48시간) 이후부터 정산
                신청이 가능합니다.
                <p className="mt-1.5 text-xs">
                  예: 7일권 상품이 4월 1일에 종료되었다면, 영업일 기준 2일 후인 4월
                  3일부터 신청 가능.
                </p>
                <p className="mt-1 text-xs">
                  이는 이용 종료 직후 발생할 수 있는 소비자의 최종 컴플레인 및
                  서비스 이용 불능 여부를 확인하기 위한 최소한의 검수 기간입니다.
                </p>
              </li>
              <li>
                <strong>정산 확정 및 지급:</strong> 판매자가 정산 신청을 완료하면,
                회사는 장애 발생 이력 및 환불 여부를 최종 확인한 후 지정된 계좌로
                입금합니다.
              </li>
              <li>
                <strong>수수료 차감:</strong> 회사는 판매 대금에서 약정된 중개 수수료
                및 결제 수수료를 제외한 금액을 판매자에게 지급합니다.
              </li>
              <li>
                <strong>지급 보류 및 차감:</strong>
                <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
                  <li>
                    이용 기간 중 발생한 장애로 인해 소비자에게 &apos;이용 기간
                    연장&apos; 보상이 지급된 경우, 해당 기간만큼의 정산금이 차감될
                    수 있습니다.
                  </li>
                  <li>
                    분쟁이 해결되지 않았거나 서비스 종료 후 중대한 하자(해킹 계정
                    등)가 발견될 경우 정산이 취소되거나 보류될 수 있습니다.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제5조 (금지 행위 및 자격 상실)
            </h2>
            <p className="mb-3">
              다음 행위 적발 시 회사는 즉시 파트너 권한을 박탈하고 재가입을
              제한합니다.
            </p>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li>
                소비자에게 직접 결제를 유도하거나 개인 연락처를 공유하는 행위 (직거래
                시도)
              </li>
              <li>
                허위 정보(무료 체험 계정, 불법 해킹 계정 등)를 공급하여 플랫폼의
                신뢰도를 실추시키는 행위
              </li>
              <li>
                고의적으로 접속 정보를 변경하여 소비자의 이용을 방해하는 행위
              </li>
              <li>
                동일한 장애가 특정 판매자에게서 반복적으로 발생하여 플랫폼 운영에
                차질을 주는 경우
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제6조 (면책 사항)
            </h2>
            <p>
              OTT 서비스 원제공사(비글루, 드라마박스 등)의 서비스 자체가 종료되거나,
              국가적 차원의 차단 등 판매자가 통제할 수 없는 불가항력적 사유로
              서비스가 중단된 경우 판매자의 고의 과실이 없는 것으로 간주하여 일할
              정산 후 종료합니다.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
