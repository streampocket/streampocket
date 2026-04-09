import type {
  LandingFaq,
  LandingNavItem,
  LandingStep,
  LandingTrustItem,
} from '@/app/(landing)/_types'

export const LANDING_SECTION_IDS = {
  products: 'products',
  steps: 'steps',
  videos: 'videos',
  faq: 'faq',
} as const // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion

export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { href: '/party', label: '전체 파티' },
  { href: `#${LANDING_SECTION_IDS.steps}`, label: '이용 방법' },
]


export const LANDING_STEPS: LandingStep[] = [
  {
    id: 'browse',
    title: '1. 파티 둘러보기',
    description:
      '드라마박스, 웨이브, 비글루 등 원하는 OTT의 모집 중인 파티를 확인하세요.',
  },
  {
    id: 'signup',
    title: '2. 회원가입 / 로그인',
    description: '간편하게 가입하고 로그인하세요.',
  },
  {
    id: 'join',
    title: '3. 파티 참여 및 결제',
    description:
      '원하는 파티를 선택하고 안전하게 결제하세요. 파티 규칙 확인 후 참여가 확정됩니다.',
  },
  {
    id: 'start',
    title: '4. OTT 이용 시작',
    description:
      '파티장이 계정 정보를 공유하면 바로 이용을 시작하세요. 문제 발생 시 고객센터에서 도와드립니다.',
  },
]


export const LANDING_TRUST_ITEMS: LandingTrustItem[] = [
  {
    id: 'safe-matching',
    title: '안전한 파티 매칭',
    description:
      '계정 판매가 아닌 파티원 매칭 구조로, 플랫폼이 파티장과 파티원을 안전하게 연결합니다.',
  },
  {
    id: 'refund-guarantee',
    title: '서비스 미제공 시 전액 환불',
    description:
      '파티장 연락 두절 등 서비스가 제공되지 않을 경우 전액 환불을 보장합니다.',
  },
  {
    id: 'customer-support',
    title: '365일 고객 지원',
    description:
      '카카오톡 채널을 통해 언제든 문의하실 수 있습니다. 파티 관련 문제를 신속하게 해결해 드립니다.',
  },
  {
    id: 'registered-business',
    title: '정식 사업자 등록 운영',
    description:
      '사업자등록증을 보유한 정식 사업체가 운영하며, 이용약관과 개인정보처리방침을 준수합니다.',
  },
]

export const LANDING_FAQS: LandingFaq[] = [
  {
    id: 'what-is-ottall',
    question: 'OTTALL은 어떤 서비스인가요?',
    answer:
      'OTT 서비스를 함께 이용할 파티원을 매칭해주는 플랫폼입니다. 파티장이 파티를 개설하고 파티원을 모집하면, OTTALL이 안전하게 매칭을 도와드립니다.',
  },
  {
    id: 'difference-faq',
    question: '계정 판매와 어떻게 다른가요?',
    answer:
      'OTTALL은 계정을 판매하지 않습니다. 파티장이 자신의 OTT 구독을 공유할 파티원을 모집하는 매칭 구조이며, 파티원은 이용 기간 동안 파티장의 계정을 공유하여 사용합니다.',
  },
  {
    id: 'refund-faq',
    question: '파티 참여 후 환불이 가능한가요?',
    answer:
      '서비스 이용 전이라면 환불이 가능합니다. 파티장의 연락 두절 등 서비스가 정상 제공되지 않는 경우 전액 환불을 보장합니다. 이용 시작 후에는 디지털 서비스 특성상 환불이 불가합니다.',
  },
  {
    id: 'payment-faq',
    question: '결제는 어떻게 진행되나요?',
    answer:
      '파티 상세 페이지에서 참여 신청 후 안전하게 결제할 수 있습니다.',
  },
  {
    id: 'duration-faq',
    question: '파티 이용 기간은 어떻게 되나요?',
    answer:
      '각 파티마다 이용 기간이 다르며, 파티 상세 페이지에서 확인할 수 있습니다. 이용 기간이 종료되면 파티가 자동으로 만료됩니다.',
  },
  {
    id: 'matching-faq',
    question: '2인 공유는 내가 직접 사람을 구해야 하나요?',
    answer:
      '아니요. 파티장이 파티를 개설하고 OTTALL 플랫폼을 통해 파티원을 모집합니다. 원하는 파티에 참여 신청만 하시면 됩니다.',
  },
  {
    id: 'contact-faq',
    question: '문의는 어디서 하나요?',
    answer:
      '카카오톡 채널을 통해 언제든 문의하실 수 있습니다. 파티 관련 문제, 결제, 환불 등 모든 문의를 도와드립니다.',
  },
]
