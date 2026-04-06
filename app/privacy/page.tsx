import type { Metadata } from 'next'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: '스트림포켓 개인정보 처리방침',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader navItems={[]} />

      <section className="mx-auto max-w-[800px] px-5 py-12 sm:px-8">
        <h1 className="mb-8 text-2xl font-bold text-text-primary">개인정보 처리방침</h1>

        <p className="mb-8 text-sm leading-relaxed text-text-secondary">
          본 개인정보 처리방침은 PG 심사 및 서비스 제공 과정에서 이용자의 개인정보 보호를
          위해 마련되었습니다.
        </p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제1조 (수집하는 개인정보 항목 및 수집방법)
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>
                필수항목: 성명(닉네임), 휴대전화번호, 서비스
                이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 결제기록(주문번호, 결제금액,
                결제수단)
              </li>
            </ul>
            <p className="mt-3">
              수집 방법: 홈페이지 회원가입, 서비스 이용, 생성정보 수집 툴을 통한 수집
            </p>
            <p className="mt-2">
              회사는 다음의 법적 근거에 따라 개인정보를 처리합니다.
            </p>
            <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
              <li>이용자의 동의</li>
              <li>서비스 제공을 위한 계약의 이행</li>
              <li>관련 법령에 따른 의무 준수</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제2조 (개인정보의 이용목적)
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>
                서비스 제공: 콘텐츠 이용권 제공 및 이용 지원 서비스 제공 및 콘텐츠 이용권
                전달
              </li>
              <li>
                이용자 관리: 본인확인, 중복가입 확인, 부정 이용 방지 및 비인가 사용 방지
              </li>
              <li>
                결제 및 정산: 유료 서비스 이용에 따른 결제 승인 및 취소, 환불 처리
              </li>
              <li>
                고객 응대: 카카오채널톡 상담 및 민원 처리, 공지사항 전달
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제3조 (개인정보의 국외 이전)
            </h2>
            <p>회사는 원칙적으로 개인정보를 국외로 이전하지 않습니다.</p>
            <p className="mt-1.5">
              다만, 서비스 제공 과정에서 국외 이전이 발생하는 경우 관련 법령에 따라 사전 고지
              및 동의를 받습니다.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제4조 (개인정보의 보유 및 이용기간)
            </h2>
            <p className="mb-3">
              원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
              파기합니다. 단, 관련 법령에 의거하여 보존할 필요가 있는 경우 아래와 같이
              보관합니다.
            </p>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제5조 (개인정보의 제3자 제공)
            </h2>
            <p className="mb-3">
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의
              경우에는 예외로 합니다.
            </p>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>
                카카오(주): 카카오 계정 연동 로그인 및 알림톡 발송 (제공항목: 카카오 고유
                식별값, 휴대폰번호)
              </li>
              <li>
                PG사(미정): 결제 서비스 이행 및 본인확인 (제공항목: 성명, 결제정보)
              </li>
              <li>
                (주)알리는사람들: 인증 문자 발송 (제공항목: 휴대폰번호)
              </li>
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의거하여 수사기관의 요구가 있는 경우</li>
            </ul>
            <p className="mt-2">
              제공받는 자, 제공 목적, 제공 항목, 보유 및 이용기간은 별도 동의 시 고지합니다.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제6조 (개인정보 처리의 위탁)
            </h2>
            <p className="mb-3">
              회사는 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁할 수 있습니다.
            </p>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>(주)알리는사람들: 문자 발송 서비스</li>
              <li>카카오(주): 알림톡 발송 및 고객 상담 시스템 제공</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제7조 (개인정보의 안전성 확보 조치)
            </h2>
            <p className="mb-3">
              회사는 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>관리적 조치: 내부관리계획 수립 및 직원 교육</li>
              <li>기술적 조치: 개인정보 암호화, 해킹 방지 시스템 운영</li>
              <li>물리적 조치: 전산실 접근 통제</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제8조 (개인정보의 파기 절차 및 방법)
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>전자적 파일 형태: 복구 불가능한 기술적 방법으로 삭제</li>
              <li>종이 문서: 분쇄 또는 소각</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제9조 (이용자의 권리와 행사 방법)
            </h2>
            <p>
              이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구를 할 수 있습니다.
              행사 방법은 카카오채널톡 또는 이메일 문의를 통해 가능합니다.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제10조 (개인정보 보호책임자)
            </h2>
            <ul className="flex flex-col gap-1.5 list-disc pl-5">
              <li>성명: 송동건</li>
              <li>직책: 개인정보 보호책임자</li>
              <li>연락처: steampocket0@gmail.com</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제11조 (쿠키의 운영 및 거부 방법)
            </h2>
            <p>
              쿠키는 이용자의 접속 빈도, 방문 시간 등을 분석하여 서비스 개선에 활용됩니다.
              이용자는 웹브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold text-text-primary">
              제12조 (개인정보 처리방침의 변경 고지)
            </h2>
            <p>
              본 개인정보 처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용이 수정될 수
              있으며, 변경 시 공지사항 또는 이메일을 통해 고지합니다.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
