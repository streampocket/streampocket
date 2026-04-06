import type { Metadata } from "next";
import { LANDING_NAV_ITEMS } from "@/app/(landing)/_data";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const metadata: Metadata = {
  title: "이용약관",
  description: "스트림포켓 서비스 이용약관 및 환불 정책",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader navItems={LANDING_NAV_ITEMS} />

      <section className="mx-auto max-w-[800px] px-5 py-12 sm:px-8">
        <h1 className="mb-8 text-2xl font-bold text-text-primary">
          서비스 이용약관 및 환불 정책
        </h1>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              서비스 정의
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>
                본 서비스는 OTT 콘텐츠 자체를 판매하는 것이 아닌, 회원 간 이용
                가능한 서비스 접근 환경을 연결·지원하는 중개형 디지털
                서비스입니다.
              </li>
              <li>
                회사는 콘텐츠의 소유권 또는 저작권을 판매하지 않으며, 이용
                권한은 서비스 이용 기간 동안에 한하여 부여됩니다.
              </li>
              <li>
                회원은 본 서비스 이용 권한을 제3자에게 양도, 판매 또는 재배포할
                수 없습니다.
              </li>
              <li>
                회사는 서비스 운영상 필요에 따라 제공 방식 또는 구성 내용을
                변경할 수 있습니다.
              </li>
              <li>
                회사는 약관을 변경할 수 있으며, 변경 시 사전 공지를 통해
                안내합니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제1조 (서비스 이용 및 결제)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                본 서비스는 결제 즉시 이용 권한이 부여되는 디지털 콘텐츠 공유
                서비스입니다.
              </li>
              <li>
                회사는 회원이 결제한 즉시 해당 OTT 서비스 이용이 가능한 환경 및
                접속 정보를 제공하기 위해 최선을 다합니다.
              </li>
              <li>
                배송 지연에 따른 보장: 쉐어 플랫폼 운영 특성상 비영업시간(평일-
                22:30 ~ 익일 10:30, 주말- 18:00 ~ 익일 10:30) 결제 건은 이용
                권한 제공이 지연될 수 있습니다. 회사는 영업시간 기준 6시간
                이내에 서비스 매칭(이용 환경 제공)이 완료되지 않을 경우, 고객의
                요청 시 어떠한 수수료도 부과하지 않고 100% 전액 환불할 것을
                보장합니다. 단, 시스템 점검, 외부 플랫폼 장애 등 불가피한 사유가
                있는 경우에는 지연될 수 있으며, 이 경우 사전 또는 사후 공지를
                통해 안내합니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제2조 (청약철회 및 환불 규정 - 소비자 권익 보호)
            </h2>
            <p className="mb-3">
              회사는 &apos;전자상거래 등에서의 소비자보호에 관한 법률&apos; 및
              &apos;콘텐츠이용자보호지침&apos;을 준수하며, 소비자의 정당한 환불
              권리를 보장합니다.
            </p>
            <ol className="flex flex-col gap-3 list-decimal pl-5">
              <li>
                <strong>전액 환불 (계정 확인 전):</strong> 결제 후
                마이페이지에서 접속 지원 정보를 열람(확인)하기 전 상태라면,
                결제일로부터 7일 이내에 언제든지 조건 없이 100% 전액 환불이
                가능합니다.
              </li>
              <li>
                <strong>청약철회 제한 (계정 확인 후):</strong> 전자상거래법
                제17조 제2항 제5호에 따라, 디지털 콘텐츠의 제공이 개시된 경우
                청약철회가 제한될 수 있습니다. 단, 제공된 콘텐츠가 표시·광고
                내용과 다르거나 계약 내용과 다르게 이행된 경우에는 예외로
                합니다.
              </li>
              <li>
                서비스 이용 개시 시점은 회원이 접속 지원 정보를 열람하거나, 실제
                로그인 또는 이용이 가능한 상태가 된 시점 중 먼저 도달한 시점으로
                봅니다.
              </li>
              <li>이용 기간은 서비스 제공 시점부터 기산됩니다.</li>
              <li>
                서비스 이용 여부 및 접속 기록에 대한 판단은 회사의 시스템 기록을
                기준으로 합니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제3조 (서비스 이용 불능에 대한 사후 조치 및 환불)
            </h2>
            <p className="mb-3">
              회사는 회원이 유료 결제한 기간 동안 중단 없는 서비스를 제공할
              의무가 있습니다. 만약 기술적 결함이나 플랫폼의 정책 변경 등으로
              서비스 이용이 불가능할 경우 다음과 같이 조치합니다. 단, 이용자의
              귀책사유가 아닌 경우에 한합니다.
            </p>
            <ol className="flex flex-col gap-3 list-decimal pl-5">
              <li>
                OTT 서비스 제공자의 정책 변경 또는 이용 제한 조치로 인해 서비스
                이용이 중단될 수 있으며, 이 경우 회사는 대체 서비스 제공 또는
                환불 기준에 따라 조치합니다.
              </li>
              <li>
                <strong>사측의 대안 마련 의무:</strong>
                <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
                  <li>
                    장애 발생 시 회사는 12시간 이내에 동일한 조건의 서비스 제공
                    또는 정상화 조치를 취하는 것을 원칙으로 합니다.
                  </li>
                  <li>
                    대체 서비스 제공을 통해 소비자의 이용 흐름이 끊기지 않도록
                    최우선적으로 노력합니다.
                  </li>
                </ul>
              </li>
              <li>
                <strong>이용 기간 연장:</strong> 장애 복구에 12시간 이상이
                소요된 경우, 회사는 장애가 발생한 시간의 1.5배에 해당하는 이용
                기간을 무상으로 연장하여 소비자의 피해를 보상합니다.
              </li>
            </ol>
            <p className="mt-3 text-xs">
              ※ 일부 기능 또는 콘텐츠 이용 제한이 발생하더라도 서비스의 본질적
              이용이 가능한 경우에는 전체 환불 대상에 해당하지 않을 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              최종 환불 (일할 계산)
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>
                위와 같은 대안 마련이 불가능하거나, 서비스 정상화가 어렵다고
                판단될 경우 회사는 지체 없이 환불을 진행합니다.
              </li>
              <li>
                환불 금액 산정 방식: 환불 금액 = 결제 금액 × (남은 잔여 일수 /
                전체 계약 일수)
              </li>
              <li>
                회사는 환불 시 소비자에게 불리한 위약금을 부과하지 않으며, 실제
                이용하지 못한 기간에 대해 정직하게 일할 계산하여 환불합니다.
              </li>
              <li>
                초기 배정 실패 시 환불: 제1조 3항에 따라 영업시간 내 6시간
                이내에 최초 이용 환경 제공이 전달되지 않은 경우, 소비자는 즉시
                계약을 해지할 수 있으며 회사는 결제 금액 전액을 환불합니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제4조 (회사의 면책 및 한계)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                회원은 제공받은 접속 정보의 보안 유지 책임이 있으며, 이를
                제3자에게 공유하거나 유출하여 발생하는 문제에 대해서는 회사가
                책임지지 않습니다.
              </li>
              <li>
                회원의 귀책 사유(비밀번호 임의 변경, 타 프로필 접속 등 약관 위반
                행위)로 이용이 정지된 경우, 회사는 환불을 제한할 수 있습니다.
                다만, 이용자가 이미 결제한 금액 중 잔여 기간에 해당하는 부분은
                회사의 귀책 여부를 고려하여 합리적인 범위 내에서 대체 서비스
                제공을 우선적으로 검토하고, 대체 서비스 제공이 불가능한 경우
                일할 환불을 진행합니다. 단, 회원이 고의적으로 공유 계정의
                비밀번호를 변경하거나 프로필을 삭제하여 타 회원의 서비스 이용을
                방해한 경우, 회사는 해당 회원에게 서비스 이용 중단 및 남은
                이용료의 환불 거부는 물론, 이로 인해 발생한 타 회원들에 대한
                환불금 및 영업 방해에 따른 손해배상을 청구할 수 있습니다.
              </li>
              <li>
                천재지변 등 불가항력적인 사유로 인한 일시적 장애는 면책될 수
                있으나, 이 경우에도 회사는 최대한 신속히 복구 안내를 진행합니다.
              </li>
              <li>
                본 서비스는 동시 접속 수 또는 이용 기기 수가 제한될 수 있으며,
                이를 초과하는 이용 시 서비스 이용이 제한될 수 있습니다. (1인
                1기기 제한)
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제5조 (부정 이용 및 제재 기준)
            </h2>
            <p className="mb-3">
              회사는 아래 행위가 확인될 경우 사전 통지 없이 서비스 이용을
              제한하거나 계약을 해지할 수 있습니다.
            </p>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>비정상적인 접속 시도 또는 다중 기기 남용</li>
              <li>
                타 이용자의 이용을 방해하는 행위(제4조1항 회원의 귀책사유 참조)
              </li>
              <li>서비스 구조를 악용한 반복 환불 요청</li>
              <li>이용 제한 이력이 있는 회원</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제6조 (환불 처리 및 접수)
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>
                단순 변심에 의한 환불의 경우에도 관련 법령에 따라 소비자의
                정당한 청약철회 권리를 보장하며, 회사의 귀책사유가 없는 경우라도
                소비자에게 불리한 수수료를 부과하지 않습니다.
              </li>
              <li>
                회사의 귀책사유로 인한 서비스 제공 불가 또는 중대한 하자가
                발생한 경우, 회사는 전액 환불을 원칙으로 합니다.
              </li>
              <li>
                회사는 서비스 운영상 필요 시 서비스를 종료할 수 있으며, 이 경우
                사전 공지 후 환불 정책에 따라 조치합니다.
              </li>
              <li>
                환불 접수는 고객센터(이메일/카카오톡 채널 등)를 통해 가능하며,
                접수 후 24시간 이내 담당자가 확인합니다.
              </li>
              <li>
                환불은 접수일로부터 영업일 기준 3일 이내 처리하는 것을 원칙으로
                합니다.
              </li>
              <li>
                환불은 원칙적으로 결제 시 사용한 결제수단으로 처리됩니다. 단,
                동일한 결제수단으로 환불이 불가능한 경우 회사는 별도의 방법으로
                환불을 진행할 수 있습니다.
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-text-primary">고객센터 운영시간</p>
            <p className="mt-1">평일 10:30 ~ 22:30</p>
            <p>주말 10:30 ~ 18:00</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
