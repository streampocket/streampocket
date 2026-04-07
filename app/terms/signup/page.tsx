import type { Metadata } from 'next'
import { LANDING_NAV_ITEMS } from '@/app/(landing)/_data'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

export const metadata: Metadata = {
  title: '서비스 이용약관',
  description: 'OTTALL 서비스 이용약관',
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignupTermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader navItems={LANDING_NAV_ITEMS} />

      <section className="mx-auto max-w-[800px] px-5 py-12 sm:px-8">
        <h1 className="mb-8 text-2xl font-bold text-text-primary">서비스 이용약관</h1>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">제1조 (목적)</h2>
            <p>
              본 약관은 OTTALL이 운영하는 웹사이트 및 서비스(이하 &quot;서비스&quot;)를 이용함에
              있어, OTTALL와 &quot;이용자&quot;의 권리, 의무 및 책임 사항을 규정함을 목적으로
              합니다.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">제2조 (용어의 정의)</h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                이용자: 본 약관에 따라 OTTALL가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
              </li>
              <li>
                회원: OTTALL에 개인정보를 제공하여 회원등록을 한 자로서, OTTALL의 정보를 지속적으로
                제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </li>
              <li>
                콘텐츠: OTTALL가 웹사이트를 통해 제공하는 이용권, 정보 및 기타 디지털 자료를
                말합니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제3조 (약관의 명시 및 개정)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에
                게시합니다.
              </li>
              <li>
                OTTALL는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시
                적용 일자 7일 전(이용자에게 불리한 경우 30일 전)부터 공지합니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제4조 (서비스의 제공 및 변경)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL는 다음 업무를 수행합니다.
                <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
                  <li>콘텐츠 및 서비스 이용권 제공</li>
                  <li>유료 서비스 결제 지원 및 관리</li>
                </ul>
              </li>
              <li>
                OTTALL는 기술적 사양의 변경이나 서비스 운영 정책에 따라 제공하는 서비스의 내용을
                변경할 수 있습니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제5조 (이용계약의 성립)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                이용계약은 이용자가 본 약관에 동의하고 회원가입 신청을 하면 OTTALL이 이를
                승낙함으로써 성립합니다.
              </li>
              <li>
                OTTALL는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에
                이용계약을 해지할 수 있습니다.
                <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
                  <li>타인의 명의를 이용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>
                    서비스의 안녕 질서 또는 미풍양속을 저해할 목적으로 신청한 경우
                  </li>
                </ul>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제6조 (이용료 및 결제)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                이용자는 OTTALL이 정한 결제수단(신용카드, 계좌이체 등)을 통해 유료 서비스를
                이용할 수 있습니다.
              </li>
              <li>
                결제와 관련된 개인정보 처리는 별도의 &quot;개인정보 처리방침&quot;을 따릅니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제7조 (청약철회 및 환불)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL의 콘텐츠는 전자상거래법 제17조 제2항 제5호에 따라 &apos;디지털
                콘텐츠&apos;에 해당하며, 서비스를 사용(이용권 등록 등)하거나 시간이 경과하여
                가치가 감소한 경우 환불이 제한될 수 있습니다.
              </li>
              <li>
                결제 후 콘텐츠를 전혀 이용하지 않은 경우, 결제일로부터 7일 이내에 청약철회를
                요청할 수 있습니다.
              </li>
              <li>
                환불 절차는 OTTALL의 고객센터(카카오채널톡 등)를 통해 진행됩니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제8조 (OTTALL의 의무)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며,
                지속적이고 안정적으로 서비스를 제공하기 위해 최선을 다합니다.
              </li>
              <li>
                OTTALL는 이용자가 안전하게 서비스를 이용할 수 있도록 개인정보 보호를 위한 보안
                시스템을 갖추어야 합니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제9조 (이용자의 의무)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                이용자는 다음 행위를 하여서는 안 됩니다.
                <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
                  <li>신청 또는 변경 시 허위 내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>OTTALL가 게시한 정보의 변경</li>
                  <li>
                    OTTALL가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시
                  </li>
                  <li>OTTALL 및 제3자의 저작권 등 지적재산권에 대한 침해</li>
                </ul>
              </li>
              <li>
                이용자는 계정 정보(이메일, 비밀번호 등)의 관리 책임이 있으며, 이를 제3자에게
                이용하게 해서는 안 됩니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제10조 (서비스의 중단)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가
                발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
              </li>
              <li>
                OTTALL의 귀책 사유로 인하여 유료 서비스가 장기간 중단되어 이용자가 손해를 입은
                경우, 관련 법령에 따라 보상합니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제11조 (저작권의 귀속 및 이용제한)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 OTTALL에 귀속됩니다.
              </li>
              <li>
                이용자는 서비스를 이용함으로써 얻은 정보를 OTTALL의 사전 승낙 없이 복제, 송신,
                출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게
                하여서는 안 됩니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">제12조 (분쟁해결)</h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기
                위하여 고객 응대 채널(카카오채널톡)을 운영합니다.
              </li>
              <li>
                OTTALL와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의
                피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는
                분쟁조정기관의 조정에 따를 수 있습니다.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제13조 (재판권 및 준거법)
            </h2>
            <ol className="flex flex-col gap-1.5 list-decimal pl-5">
              <li>
                OTTALL와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에
                제기합니다.
              </li>
              <li>
                본 약관의 해석 및 분쟁에 대해서는 대한민국 법령을 적용합니다.
              </li>
            </ol>
          </div>

          <div className="border-t border-border pt-4">
            <p className="font-semibold text-text-primary">[부칙]</p>
            <p className="mt-1">본 약관은 2026년 4월 8일부터 시행됩니다.</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
