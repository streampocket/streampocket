export const STOCK_THRESHOLD_WARN = 2;
export const STOCK_THRESHOLD_CRITICAL = 0;
export const PAGE_SIZE = 20;
export const ORDER_POLL_INTERVAL_SECONDS = 300;
export const INITIAL_LOOKBACK_MINUTES = 10;
export const BRAND_NAME = "스트림포켓";
export const USER_BRAND_NAME = "OTTALL";
export const LOGIN_PATH = "/login";
export const USER_LOGIN_PATH = "/signin";
export const USER_SIGNUP_PATH = "/signup";
export const USER_MYPAGE_PATH = "/mypage";
export const KAKAO_OPEN_CHAT_URL = "https://pf.kakao.com/_MkxalX";

export const PARTY_DEFAULT_RULES = [
  "운영시간 기준 6시간 내 파티장 연락 두절시 100% 전액환불 가능",
  "디지털 상품은 '이용 후 환불 불가'",
];

export const NAVER_API_BASE_URL = "https://api.commerce.naver.com/external";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const YOUTUBE_CHANNELS = [
  { name: 'DramaBox', channelId: 'UCyKIeHu9Sv7_3Gqbg-vo3bg' },
  { name: 'DramaWave', channelId: 'UCOSVEh-kzZ8yBYtEQMHBEaQ' },
  { name: 'Vigloo', channelId: 'UCNhfB7PdIcFLB-eMvWfGI0A' },
] as const; // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion
