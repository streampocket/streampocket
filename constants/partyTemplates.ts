import { USER_SITE_URL } from "./app";

// 파티 승인 후 구매자에게 보내는 안내 양식.
// 알림톡 자동 발송 대신 관리자가 신청 관리 상세에서 복사해 직접 전달한다(2026-09 전환).
// 본문을 fe에 두는 이유: 만료일·파티 타입이 이미 상세 응답에 있어 서버 왕복 없이 조립할 수 있다.
// 문구가 자주 바뀌면 DB 관리로 옮겨야 한다 — 지금은 3개 고정이라 상수로 충분하다.

export type PartyTemplateVars = {
  /** 이용 만료일 'MM-DD' (KST) */
  expiresAtLabel: string;
};

export type PartyMessageTemplate = {
  id: string;
  /** 화면에 노출되는 제목 — 관리자는 이것만 보고 복사한다 */
  title: string;
  /** 공유형 파티에서만 노출할지 */
  sharedOnly: boolean;
  build: (vars: PartyTemplateVars) => string;
};

const SHARED_LOGOUT_GUIDE = `공유형(쉐어) 상품 이용 중 발생할 수 있는 로그아웃 현상에 대해 안내해 드립니다.

🔒 왜 로그아웃이 되나요?
파티원의 기간이 만료될 때마다 보안을 위해 주기적으로 계정 비밀번호를 변경하고 있습니다.
이 과정에서 기존 이용자분들이 간혹 로그아웃될 수 있습니다.

⚠️ 저희가 계정을 회수하는 것이 아니니 절대 안심하셔도 됩니다!

💬 로그아웃이 되었다면?
아직 이용 기간이 남았는데 로그아웃이 되어 있다면 당황하지 마세요!
구매하셨던 문의 채팅으로 연락 주시면 바로 다시 로그인하실 수 있도록 도와드리겠습니다.

💡 번거로움 없이 이용하고 싶다면?
비밀번호 변경이나 간헐적인 로그아웃 없이 조용하고 편하게 이용하고 싶으신 분들께는 프라이빗(개인형) 상품 이용을 강력히 추천해 드립니다!`;

// [ ] 안에 파티별 만료일이 들어간다. "현재시간 까지"가 뒤에 붙으므로 날짜만 넣는다.
// 조기 만료 안내(●로 시작하는 줄): 차감형은 파티 종료 시각이 "파티 첫 승인 시각"에 고정돼,
// 늦게 합류한 구매자가 읽는 "현재시간"과 실제 만료 시각이 어긋난다
// (be resolveApplicationExpiry — 구조적으로 0~24시간, 운영 관측치 약 5시간).
// 유지형은 승인시각 + 기간이라 어긋나지 않지만, 보수적 안내로 모든 파티에 함께 노출한다.
const purchaseGuide = ({ expiresAtLabel }: PartyTemplateVars) => `🛑 🚨[중요] 설명대로 안 하시면 로그인이 즉시 차단됩니다!🚨🚨
⚠️ [하단의 로그인 방법을 숙지하지 않으시면, 상담 및 문제 해결이 불가능합니다.]

1. 👥 공유형: 기간 중 로그아웃 확률 30%(재로그인 가능) ➡️ 모바일 1대 가능

2. 👤 개인형: 기간 중 로그아웃 확률 10%(재로그인 가능) ➡️ 모바일 2대 가능

3. 금지사항: 타인 공유 ❌ | PC 로그인 ❌ | 비번·정보 변경 ❌ | VPN 우회 ❌
💬 이용 중 문제 생기면 바로 문의주세요!

📅 [만료 안내] 꼭 확인해 주세요!
⏳이용 기간: [ ${expiresAtLabel} ] 현재시간 까지
만료되면 다음 사용자를 위해 반드시 직접 로그아웃 부탁드립니다! (매너 필수)
●구매 시점보다 약 5시간 일찍 만료될 수 있습니다. (파티 시스템 특성)

⛔ [로그인 방법] 순서대로 따라 해주세요!
1. 앱 실행 ➡️ [Google 로그인] 선택
2. 안내받은 '아이디' / '비밀번호' 입력
3. 🚨 2단계 인증 화면이 뜬 경우
　→ (1) 화면 하단의 [다른 방법 시도]를 눌러주세요.
　→ (2) 옵션 목록에서 [구글OTP] or [Google Authenticator] 를 선택합니다. (※보안코드 X)
4. 채팅창에 'OTP 요청' 채팅을 보내거나, 홈페이지의 [마이페이지] 구매내역에서 OTP 받기

⚠️ (중요) 만약 인증화면[Google Authenticator]이 한 번 더 반복되어 뜨면, 당황하지 마시고 OTP 재발급 후 인증하시면 됩니다.`;

// [POINT]는 일부러 그대로 둔다 — 관리자가 붙여넣은 뒤 상황에 맞게 고쳐 쓴다
const REVIEW_EVENT = `이용해 주셔서 감사합니다! ✨
3일 이내, 단 1글자만 써도 💰 [POINT] 즉시 지급!
소중한 한마디가 더 나은 서비스를 만드는 큰 힘이 됩니다. 💙

🔗 [1초 만에 리뷰 쓰러 가기] 👉 ${USER_SITE_URL}/reviews`;

export const PARTY_MESSAGE_TEMPLATES: readonly PartyMessageTemplate[] = [
  {
    id: "shared-logout",
    title: "공유형일때",
    sharedOnly: true,
    build: () => SHARED_LOGOUT_GUIDE,
  },
  {
    id: "purchase-guide",
    title: "구매 안내사항",
    sharedOnly: false,
    build: purchaseGuide,
  },
  {
    id: "review-event",
    title: "리뷰 이벤트",
    sharedOnly: false,
    build: () => REVIEW_EVENT,
  },
];

/** 구매자에게 전달할 계정 정보 — OTP 시크릿은 넣지 않는다(구매자는 사이트·채팅으로 발급받는다) */
export function buildAccountCredentialText(email: string, password: string): string {
  return `아이디: ${email}\n비밀번호: ${password}`;
}
