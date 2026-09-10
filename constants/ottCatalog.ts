import { OTT_IMAGES } from './ottImages'

/**
 * OTT 대표 페이지(`/ott/{slug}`) 전용 정보.
 *
 * 파티 상세(`/party/{uuid}`)는 정원이 차면 재생성되어 주소가 매번 바뀌지만,
 * 이 페이지는 OTT당 하나로 고정되어 검색 색인의 안정적인 대상이 된다.
 *
 * label·이미지는 `OTT_IMAGES`에서 파생한다 — 정본을 한 곳에 두면 두 값이 어긋날 수 없고,
 * `OTT_IMAGES`를 수정하지 않으므로 관리자 파티 생성 폼(ImageSelector)에 영향이 없다.
 *
 * slug는 검색에 노출되는 주소라 한번 정하면 바꾸지 않는다.
 */
type LandingInfo = {
  slug: string
  /** 영문 표기 — 제목 병기·keywords용 ("드라마 박스 (Dramabox)") */
  en: string
  /** h1 아래 한 줄 */
  tagline: string
  /** 본문 소개 (2~3문장) */
  description: string
}

const SHARED_TAIL =
  'OTTALL이 파티원을 모아 계정을 배정하고, 이용 기간 동안 로그인 정보와 인증번호 발급을 관리합니다.'

/** OTT_IMAGES의 label 7종 전부를 키로 가져야 한다 (누락 시 OTT_CATALOG 생성 단계에서 걸러짐) */
const LANDING_INFO: Record<string, LandingInfo> = {
  '드라마 박스': {
    slug: 'dramabox',
    en: 'Dramabox',
    tagline: '드라마박스를 파티로 저렴하게',
    description:
      '드라마박스(Dramabox)는 짧은 회차로 빠르게 전개되는 숏폼 드라마 플랫폼입니다. 혼자 결제하면 부담스러운 구독료를 파티원끼리 나눠 정가보다 저렴하게 이용할 수 있습니다. ' +
      SHARED_TAIL,
  },
  '드라마 웨이브': {
    slug: 'dramawave',
    en: 'Dramawave',
    tagline: '드라마웨이브를 파티로 저렴하게',
    description:
      '드라마웨이브(Dramawave)는 숏폼 드라마를 몰아보기 좋은 플랫폼입니다. 구독료를 파티원끼리 나눠 부담을 줄이고, 원하는 기간만 골라 이용할 수 있습니다. ' +
      SHARED_TAIL,
  },
  릴숏: {
    slug: 'reelshort',
    en: 'Reelshort',
    tagline: '릴숏을 파티로 저렴하게',
    description:
      '릴숏(Reelshort)은 세로형 숏폼 드라마로 잘 알려진 플랫폼입니다. 파티로 함께 이용하면 정가보다 낮은 금액으로 시청할 수 있습니다. ' +
      SHARED_TAIL,
  },
  비글루: {
    slug: 'vigloo',
    en: 'Vigloo',
    tagline: '비글루를 파티로 저렴하게',
    description:
      '비글루(Vigloo)는 숏폼 드라마를 편하게 즐길 수 있는 플랫폼입니다. 구독료를 파티원끼리 나눠 부담을 줄이고, 남은 기간만큼 할인된 금액으로 중간 참여도 가능합니다. ' +
      SHARED_TAIL,
  },
  넷숏: {
    slug: 'netshort',
    en: 'Netshort',
    tagline: '넷숏을 파티로 저렴하게',
    description:
      '넷숏(Netshort)은 숏폼 드라마 전문 플랫폼입니다. 혼자 구독하기 아까운 금액을 파티로 나눠 부담 없이 이용할 수 있습니다. ' +
      SHARED_TAIL,
  },
  숏맥스: {
    slug: 'shortmax',
    en: 'Shortmax',
    tagline: '숏맥스를 파티로 저렴하게',
    description:
      '숏맥스(Shortmax)는 짧은 호흡의 드라마를 모아 볼 수 있는 숏폼 플랫폼입니다. 파티로 구독료를 나눠 정가보다 저렴하게 시청할 수 있습니다. ' +
      SHARED_TAIL,
  },
  플릭릴스: {
    slug: 'flickreels',
    en: 'FlickReels',
    tagline: '플릭릴스를 파티로 저렴하게',
    description:
      '플릭릴스(FlickReels)는 숏폼 드라마를 제공하는 플랫폼입니다. 파티원끼리 계정을 나눠 쓰면 구독료 부담을 크게 줄일 수 있습니다. ' +
      SHARED_TAIL,
  },
}

export type OttCatalogEntry = LandingInfo & {
  /** 파티명·카테고리명과 같은 한글 라벨 (공백 포함) */
  label: string
  imagePath: string
}

export const OTT_CATALOG: readonly OttCatalogEntry[] = OTT_IMAGES.flatMap((image) => {
  const info = LANDING_INFO[image.label]
  // LANDING_INFO에 키가 빠지면 랜딩 페이지가 조용히 없어지는 대신 목록에서 제외된다.
  // 새 OTT를 OTT_IMAGES에 추가하면 여기에도 넣어야 한다.
  if (!info) return []
  return [{ ...info, label: image.label, imagePath: image.path }]
})

/** 파티명·카테고리명의 공백·표기 차이를 흡수하기 위한 정규화 */
function normalize(name: string): string {
  return name.replace(/\s+/g, '')
}

/** 표기 변형 흡수 — 파티명이 '플릭릴즈'로 적힌 경우도 같은 OTT로 본다 */
const LABEL_ALIASES: Record<string, string> = {
  플릭릴즈: '플릭릴스',
}

export function findOttBySlug(slug: string): OttCatalogEntry | null {
  return OTT_CATALOG.find((ott) => ott.slug === slug) ?? null
}

/**
 * 파티명·카테고리명으로 OTT를 찾는다.
 *
 * 파티명은 이미지 선택으로 라벨 7종이 정확히 들어가지만, 수정 폼에서 자유롭게 고칠 수 있어
 * 공백 차이나 표기 변형이 생길 수 있다. 매칭에 실패하면 null이고, 호출측은 랜딩 링크 대신
 * 목록(`/party`)으로 폴백한다.
 */
export function findOttByLabel(name: string): OttCatalogEntry | null {
  const key = normalize(name)
  const aliased = LABEL_ALIASES[key] ? normalize(LABEL_ALIASES[key]) : key
  return OTT_CATALOG.find((ott) => normalize(ott.label) === aliased) ?? null
}
