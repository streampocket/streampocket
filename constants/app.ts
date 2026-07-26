import type { BadgeVariant } from "@/components/ui/Badge";
import type { PartyType, PartyDurationMode } from "@/types/domain";

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

/** 스토어별 라벨 + 뱃지 색 (스트림포켓=파랑, 포켓몬스팀=빨강). 뱃지/탭 공통 사용. */
export const STORE_META = {
  streampocket: { label: "스트림포켓", badgeVariant: "blue" },
  pokemon_steam: { label: "포켓몬스팀", badgeVariant: "red" },
} as const;

/** 비용/수동매출 입력 폼의 사업 귀속 선택 옵션. value "" = 공통(전사). */
export const STORE_FORM_OPTIONS = [
  { value: "", label: "공통(전사)" },
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
/** OTTALL 유저 사이트 대표 도메인 — canonical/OG/sitemap/robots 공통 사용 */
export const USER_SITE_URL = "https://ottall.com";
/**
 * SNS 링크 미리보기 대표 이미지 (1200×630).
 *
 * 실체는 `app/opengraph-image.png` 파일 규약이 만들어 주는 라우트다.
 * 파일 규약은 openGraph를 **선언하지 않은** 페이지에만 자동 상속되고,
 * 페이지가 openGraph를 선언하면 그 객체가 통째로 교체되어 이미지가 사라진다
 * (next/dist/lib/metadata/resolve-metadata.js: `target.openGraph = resolveOpenGraph(source.openGraph, ...)`).
 * 그래서 openGraph를 선언하는 페이지는 이 상수로 이미지를 명시해야 한다.
 * 상대 경로는 루트 레이아웃의 metadataBase 기준으로 절대 URL로 변환된다.
 * width/height를 함께 주는 이유: 파일 규약이 자동으로 넣어주는 og:image:width/height를
 * 명시 경로에서는 Next가 알 수 없어, 없으면 일부 크롤러가 카드 렌더를 지연시킨다.
 */
export const USER_OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${USER_BRAND_NAME} — OTT 공동구독 파티 매칭 플랫폼`,
};
export const LOGIN_PATH = "/login";
export const USER_LOGIN_PATH = "/signin";
export const USER_SIGNUP_PATH = "/signup";
export const USER_MYPAGE_PATH = "/mypage";
export const TRACK_PATH = "/track";
// 카카오톡 상담 — 채널 홈이 아닌 1:1 채팅으로 바로 연결 (모든 문의 버튼 공통)
export const KAKAO_CHAT_URL = "http://pf.kakao.com/_MkxalX/chat";
// 파티 OTP — 구매자당 최대 발급(차감) 횟수 (be/src/constants/party.ts와 동일 값 유지)
export const PARTY_OTP_MAX_ISSUES = 3;
// 마이페이지 구매내역 직행 경로 — 알림톡 링크 등 외부 진입점에서도 사용하므로 변경 금지
export const USER_MYPAGE_PURCHASES_PATH = "/mypage?tab=purchases";
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
  "/gcoin",
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

/** 파티 타입별 라벨 + 뱃지 색 (개인형=핑크, 공유형=인디고). 카드/상세/관리자 목록 공통 사용. */
export const PARTY_TYPE_META: Record<PartyType, { label: string; variant: BadgeVariant }> = {
  personal: { label: "개인형", variant: "pink" },
  shared: { label: "공유형", variant: "indigo" },
};

/** 파티 기간 방식별 라벨 + 설명 + 뱃지 색 (관리자 전용). 차감형=orange, 유지형=teal. */
export const PARTY_DURATION_MODE_META: Record<
  PartyDurationMode,
  { label: string; description: string; variant: BadgeVariant }
> = {
  countdown: {
    label: "기간 차감형",
    variant: "orange",
    description: "첫 참여자부터 공유 만료일이 시작되고 매일 가격이 내려갑니다.",
  },
  fixed: {
    label: "기간 유지형",
    variant: "teal",
    description: "참여일 기준으로 각자 전체 기간을 보장하고 가격이 고정됩니다.",
  },
};

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

/** 회원 탈퇴 사유 선택지 — be(userWithdrawalService)의 WITHDRAWAL_REASON_LABELS와 코드 일치 필수 */
export const WITHDRAWAL_REASONS = [
  { code: "price", label: "가격이 비싸서" },
  { code: "low_usage", label: "이용 빈도가 낮아서" },
  { code: "no_party", label: "원하는 파티가 없어서" },
  { code: "dissatisfied", label: "서비스 불만" },
  { code: "other", label: "기타" },
] as const; // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion

export type WithdrawalReasonCode = (typeof WITHDRAWAL_REASONS)[number]["code"];

/** 탈퇴 회원 정보 보관 일수 (안내 문구용 — 실제 삭제는 백엔드 크론) */
export const WITHDRAWAL_RETENTION_DAYS = 30;

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
