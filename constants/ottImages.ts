export const OTT_IMAGES = [
  { path: '/images/ott/drama-box.png', label: '드라마 박스' },
  { path: '/images/ott/drama-wave.jpg', label: '드라마 웨이브' },
  { path: '/images/ott/reelshort.jpg', label: '릴숏' },
  { path: '/images/ott/bigloo.png', label: '비글루' },
  { path: '/images/ott/netshot.png', label: '넷숏' },
  { path: '/images/ott/shortmax.png', label: '숏맥스' },
  { path: '/images/ott/flickreels.jpg', label: '플릭릴스' },
] as const

/**
 * 파티명이 계정 자동 배정 대상인지.
 *
 * 백엔드는 파티명을 키로 드라마 계정 platform 약칭을 찾는다
 * (be/src/constants/dramaPlatform.ts — '비글루' → '비글'). 그 키 목록이 곧 여기 라벨 7종이라,
 * 이미지로 만든 파티는 이름이 정확히 일치한다.
 *
 * 다만 파티 수정 폼에서 이름을 자유롭게 고칠 수 있어("데모 비글루"처럼 접두어가 붙으면)
 * 매칭이 깨지는데, 에러 없이 자동발송만 조용히 멈춘다. 그래서 수정 화면에서 미리 경고한다.
 *
 * 새 OTT를 추가할 때는 위 배열과 be의 매핑표를 **함께** 갱신해야 한다.
 */
export function isAutoAssignablePartyName(name: string): boolean {
  const trimmed = name.trim()
  return OTT_IMAGES.some((img) => img.label === trimmed)
}
