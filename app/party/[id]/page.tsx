import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { getOttEnglishName, withOttEnglishName } from '@/constants/ottNames'
import { fetchOwnProductServer } from '@/lib/ownProductServerApi'
import { OwnProductDetail } from './_components/OwnProductDetail'

const SITE_URL = 'https://ottall.com'

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
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
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
  const images = imageUrl ? [imageUrl] : []

  return {
    title: pageTitle,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: ogTitle,
      description,
      images,
      url: `${SITE_URL}/party/${product.id}`,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
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
      url: `${SITE_URL}/party/${product.id}`,
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
      <OwnProductDetail />
    </section>
  )
}
