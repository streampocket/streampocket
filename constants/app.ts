export const STOCK_THRESHOLD_WARN = 2;
export const STOCK_THRESHOLD_CRITICAL = 0;

/** 상품 카드 "수동가격" = 판매가에서 이 비율만큼 할인한 금액 (현재 5%) */
export const MANUAL_PRICE_DISCOUNT_RATE = 0.05;
export const PAGE_SIZE = 20;
export const PRODUCTS_PAGE_SIZE = 100;

/** 멀티스토어 — 상품관리 스토어 필터 옵션 (value는 Prisma Store enum과 일치) */
export const STORES = [
  { value: "streampocket", label: "스트림포켓" },
  { value: "pokemon_steam", label: "포켓몬스팀" },
] as const;
export const ORDER_POLL_INTERVAL_SECONDS = 300;
export const INITIAL_LOOKBACK_MINUTES = 10;

/** 비용추가 모달의 주문 선택 리스트에 노출할 주문의 시작 시각 (KST).
 *  이 시각 이전 주문은 OrderPicker에 보이지 않는다. 비용 등록·통계·알림에는 영향 없음. */
export const EXPENSE_ORDER_LINK_SINCE = "2026-05-20T20:30:00+09:00";

/** OrderPicker 노출에서 제외하는 주문 상태 (비용 대상이 아닌 상태) */
export const EXPENSE_ORDER_LINK_EXCLUDE_STATUSES = ["failed", "returned"] as const;
export const BRAND_NAME = "스트림포켓";
export const USER_BRAND_NAME = "OTTALL";
export const LOGIN_PATH = "/login";
export const USER_LOGIN_PATH = "/signin";
export const USER_SIGNUP_PATH = "/signup";
export const USER_MYPAGE_PATH = "/mypage";
export const KAKAO_OPEN_CHAT_URL = "https://pf.kakao.com/_MkxalX";
export const KAKAO_PAYMENT_CHAT_URL = "http://pf.kakao.com/_MkxalX/chat";
export const NAVER_PAY_HISTORY_URL = "https://pay.naver.com/history?page=1";

export const ADMIN_PATH_PREFIXES = [
  "/dashboard",
  "/products",
  "/orders",
  "/revenue",
  "/codes",
  "/alimtalk",
  "/review-codes",
  "/settings",
  "/community-admin",
  "/ottall",
  "/login",
] as const; // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion

// 진행중 전환 시 적용하는 전역 기본 소요시간 선택지 (관리자 설정 페이지)
export const DURATION_OPTIONS = [
  { label: "20분", minutes: 20 },
  { label: "40분", minutes: 40 },
  { label: "1시간", minutes: 60 },
  { label: "1시간 30분", minutes: 90 },
  { label: "2시간", minutes: 120 },
] as const; // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion

export const PARTY_DEFAULT_RULES = [
  "운영시간 기준 6시간 내 파티장 연락 두절시 100% 전액환불 가능",
  "디지털 상품은 '이용 후 환불 불가'",
];

export const NAVER_API_BASE_URL = "https://api.commerce.naver.com/external";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const REVIEW_PAGE_SIZE = 12;
export const REVIEW_ADMIN_PAGE_SIZE = 20;
export const REVIEW_CONTENT_MAX_LENGTH = 2000;
export const REVIEW_RATING_MAX = 5;
export const REVIEW_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const REVIEW_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const COMMUNITY_PAGE_SIZE = 20;
export const COMMUNITY_TITLE_MAX_LENGTH = 100;
export const COMMUNITY_CONTENT_MAX_LENGTH = 5000;
export const COMMUNITY_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const COMMUNITY_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const YOUTUBE_CHANNELS = [
  { name: 'DramaBox', channelId: 'UCyKIeHu9Sv7_3Gqbg-vo3bg' },
  { name: 'DramaWave', channelId: 'UCOSVEh-kzZ8yBYtEQMHBEaQ' },
  { name: 'Vigloo', channelId: 'UCNhfB7PdIcFLB-eMvWfGI0A' },
] as const; // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion
