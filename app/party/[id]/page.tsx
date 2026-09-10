import type { Metadata } from 'next'
import { USER_BRAND_NAME, USER_OG_IMAGE, USER_SITE_URL } from '@/constants/app'
import { getOttEnglishName, withOttEnglishName } from '@/constants/ottNames'
import { fetchOwnProductServer } from '@/lib/ownProductServerApi'
import { OwnProductDetail } from './_components/OwnProductDetail'

type PageProps = {
  params: Promise<{ id: string }>
}

// dangerouslySetInnerHTML에 notes(사용자 입력 가능)가 포함되므로
// `<`를 유니코드 이스케이프하여 `</script>` 주입을 차단한다.
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

// imagePath는 상대경로(/images/...) 또는 전체 URL일 수 있어, 검색엔진/OG용 절대 URL로 정규화한다.
function absoluteImageUrl(path: string | null): string | null {
  if (!path) return null
  return path.startsWith('http') ? path : `${USER_SITE_URL}${path}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await fetchOwnProductServer(id).catch(() => null)
  if (!product) {
    // 레이아웃 template('%s | OTTALL')이 접미사를 붙이므로 접미사 없이 반환
    return { title: '파티 상세' }
  }

  const remaining = Math.max(0, product.totalSlots - product.filledSlots)
  const priceText = product.currentPrice.toLocaleString('ko-KR')
  const englishName = getOttEnglishName(product.name)
  const displayName = withOttEnglishName(product.name)
  // 레이아웃 title.template('%s | OTTALL')이 접미사를 자동 부착하므로 page는 접미사 없이 반환
  const pageTitle = `${displayName} 파티 월 ${priceText}원`
  const ogTitle = `${pageTitle} | ${USER_BRAND_NAME}`
  const slotText =
    product.status === 'recruiting' && remaining > 0
      ? `남은 자리 ${remaining}자리.`
      : '모집이 마감되었어요.'
  // 드라마 OTT(영어 이름 매칭)면 "숏폼 드라마" 검색 대응 문구로 생성
  const description = englishName
    ? `OTTALL에서 숏폼 드라마 플랫폼 ${displayName} 파티를 월 ${priceText}원에 함께 이용하세요. ${slotText}`
    : `OTTALL에서 ${product.name} 파티를 월 ${priceText}원에 함께 이용하세요. ${slotText}`
  const keywords = englishName
    ? [
        product.name,
        englishName,
        `${englishName} 파티`,
        `${product.name} 공유`,
        '숏폼 드라마',
        '숏폼 드라마 앱',
      ]
    : [product.name, `${product.name} 파티`, `${product.name} 공유`]
  const imageUrl = absoluteImageUrl(product.imagePath)
  // openGraph를 선언한 페이지는 대표 OG 이미지를 상속받지 못하므로 폴백을 직접 지정한다.
  const images = [imageUrl ? { url: imageUrl } : USER_OG_IMAGE]
  // OTT 로고는 정사각(225px)이라 소형 카드가 규격에 맞고,
  // 로고가 없어 대표 OG(1200×630 가로형)로 폴백할 때만 큰 카드가 맞다.
  const twitterCard = imageUrl ? 'summary' : 'summary_large_image'

  return {
    title: pageTitle,
    description,
    keywords,
    // 마감·만료 파티에도 noindex를 붙이지 않는다.
    //
    // 2026-08에 "사이트 안에서 못 찾는 페이지는 색인 제외"라는 판단으로 noindex를 넣었는데,
    // 파티는 정원이 차면 관리자가 재생성하는 구조라(월 ~900개) 색인된 페이지가 계속 빠져나갔다.
    // 네이버 서치어드바이저에 "meta robots으로 색인 제외"가 쌓여 검색 유입이 급감했다.
    //
    // 마감 파티로 들어온 방문자는 OwnProductDetail의 마감 안내 박스가 모집중 파티로 안내하므로
    // 색인을 유지해도 빈손으로 돌아가지 않는다. 상세는 sitemap에도 계속 넣어 재크롤을 유도한다.
    // utm 등 쿼리 변형 주소를 대표 주소 하나로 통합 (중복 색인 방지)
    alternates: { canonical: `${USER_SITE_URL}/party/${product.id}` },
    openGraph: {
      type: 'website',
      title: ogTitle,
      description,
      images,
      url: `${USER_SITE_URL}/party/${product.id}`,
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description,
      images,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await fetchOwnProductServer(id).catch(() => null)

  const jsonLdImage = product && absoluteImageUrl(product.imagePath)
  const jsonLdEnglishName = product && getOttEnglishName(product.name)
  const jsonLd = product && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(jsonLdEnglishName ? { alternateName: jsonLdEnglishName } : {}),
    category: product.category.name,
    ...(jsonLdImage ? { image: [jsonLdImage] } : {}),
    ...(product.notes
      ? { description: product.notes.replace(/\s+/g, ' ').trim().slice(0, 200) }
      : {}),
    offers: {
      '@type': 'Offer',
      price: product.currentPrice,
      priceCurrency: 'KRW',
      availability:
        product.status === 'recruiting'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${USER_SITE_URL}/party/${product.id}`,
    },
  }

  return (
    <section className="py-4">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
      {/* 서버가 JSON-LD를 만들며 이미 가져온 파티를 그대로 넘긴다 —
          서버 렌더 HTML에 실제 내용이 담기고 클라이언트의 중복 호출이 사라진다 */}
      <OwnProductDetail id={id} initialProduct={product} />
    </section>
  )
}
