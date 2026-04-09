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
    id: 'login',
    title: '1. 로그인',
    description: '로그인 페이지에서 회원가입 이동',
  },
  {
    id: 'select',
    title: '2. 상품 선택',
    description: 'Share 또는 Private 선택',
  },
  {
    id: 'join',
    title: '3. 파티 참여',
    description: '남은 자리 확인 후 참여',
  },
  {
    id: 'start',
    title: '4. 사용 시작',
    description: '문제 발생 시 AS 안내',
  },
]


export const LANDING_TRUST_ITEMS: LandingTrustItem[] = [
  {
    id: 'matching',
    title: '파티 매칭형',
    description: '계정 판매형이 아닌 참여 구조',
  },
  {
    id: 'login-based',
    title: '로그인 중심 이용',
    description: '회원가입은 로그인 페이지에서 이동',
  },
  {
    id: 'support',
    title: '문의 및 AS',
    description: '카카오톡 문의 및 AS 안내 제공',
  },
]

export const LANDING_FAQS: LandingFaq[] = [
  {
    id: 'matching-faq',
    question: '2인 공유는 내가 사람을 직접 구해야 하나요?',
    answer: '아니요. 방장이 매칭합니다.',
  },
  {
    id: 'signup-faq',
    question: '회원가입은 어디서 하나요?',
    answer: '로그인 페이지에서 회원가입으로 이동합니다.',
  },
]
