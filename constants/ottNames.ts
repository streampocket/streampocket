// 드라마 OTT 한글 이름 → 영어 공식 명칭 매핑.
// 사용자 페이지 병기 + SEO 전용 — 관리자 페이지에는 노출하지 않는다.
// 매칭은 공백 제거 후 포함 여부로 판단 — DB 상품명이 '드라마 박스'처럼 공백을 포함해도 매칭된다.
const OTT_ENGLISH_NAMES = [
  { ko: '드라마박스', en: 'Dramabox' },
  { ko: '드라마웨이브', en: 'Dramawave' },
  { ko: '비글루', en: 'Vigloo' },
  { ko: '릴숏', en: 'Reelshort' },
  { ko: '넷숏', en: 'Netshort' },
  { ko: '플릭릴스', en: 'FlickReels' },
  { ko: '플릭릴즈', en: 'FlickReels' }, // 표기 변형 대비 (스/즈)
  { ko: '숏맥스', en: 'Shortmax' },
] as const

// SEO keywords용 영어 이름 목록 (표기 변형 중복 제거)
export const OTT_ENGLISH_NAME_LIST: readonly string[] = Array.from(
  new Set(OTT_ENGLISH_NAMES.map((entry) => entry.en)),
)

// 상품/카테고리 이름에서 드라마 OTT 영어 이름을 찾는다. 미매칭(넷플릭스 등) 시 null.
export function getOttEnglishName(name: string): string | null {
  const normalized = name.replace(/\s+/g, '')
  const found = OTT_ENGLISH_NAMES.find((entry) => normalized.includes(entry.ko))
  return found?.en ?? null
}

// 매칭 시 '드라마 박스 (Dramabox)' 형태로 병기, 미매칭 시 원본 그대로.
export function withOttEnglishName(name: string): string {
  const english = getOttEnglishName(name)
  return english ? `${name} (${english})` : name
}
