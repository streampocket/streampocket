import type { Metadata } from 'next'
import { FaqSection } from '@/app/(landing)/_components/FaqSection'
import { HeroSection } from '@/app/(landing)/_components/HeroSection'
import { PopularProductsSection } from '@/app/(landing)/_components/PopularProductsSection'
import { ReviewsSection } from '@/app/(landing)/_components/ReviewsSection'
import { StepsSection } from '@/app/(landing)/_components/StepsSection'
import { TrustSection } from '@/app/(landing)/_components/TrustSection'
import { VideoSection } from '@/app/(landing)/_components/VideoSection'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicHeader } from '@/components/layout/PublicHeader'
import {
  LANDING_FAQS,
  LANDING_NAV_ITEMS,
  LANDING_REVIEWS_LIMIT,
  LANDING_SECTION_IDS,
  LANDING_STEPS,
  LANDING_TRUST_ITEMS,
} from '@/app/(landing)/_data'
import { API_BASE_URL, USER_BRAND_NAME } from '@/constants/app'
import { fetchLatestVideos } from '@/app/(landing)/_lib/fetchYoutubeRss'
import { fetchLandingReviews } from '@/app/(landing)/_lib/fetchLandingReviews'
import type { OwnProduct, OwnReview } from '@/types/domain'

export const metadata: Metadata = {
  title: `${USER_BRAND_NAME} | OTT 공동구독 파티 매칭 플랫폼`,
  description:
    'OTTALL(오티티올)에서 드라마박스, 드라마웨이브, 비글루, 릴숏, 넷숏, 숏맥스, 플릭릴스 등 OTT멤버십(구독권)을 파티(쉐어)로 나눠 저렴하게(싸게) 이용하세요.',
  keywords: ['ottall', '오티티올', 'OTT 공동구독', 'OTT 파티 매칭', '드라마박스', '웨이브', '비글루', '드라마웨이브', '릴숏', '넷숏', '숏맥스', '플릭릴스', '쇼츠드라마'],
  robots: { index: true, follow: true },
  openGraph: {
    title: `${USER_BRAND_NAME} | OTT 공동구독 파티 매칭 플랫폼`,
    description:
      'OTTALL(오티티올)에서 드라마박스, 드라마웨이브, 비글루, 릴숏, 넷숏, 숏맥스, 플릭릴스 등 OTT멤버십(구독권)을 파티(쉐어)로 나눠 저렴하게(싸게) 이용하세요.',
    url: 'https://ottall.com',
    siteName: USER_BRAND_NAME,
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${USER_BRAND_NAME} | OTT 공동구독 파티 매칭 플랫폼`,
    description:
      'OTTALL(오티티올)에서 드라마박스, 드라마웨이브, 비글루, 릴숏, 넷숏, 숏맥스, 플릭릴스 등 OTT멤버십(구독권)을 파티(쉐어)로 나눠 저렴하게(싸게) 이용하세요.',
  },
}

async function fetchPopularProducts(): Promise<OwnProduct[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/own/products?status=recruiting&limit=4`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return []
    const json = await res.json() as { data: OwnProduct[] }
    return json.data
  } catch {
    return []
  }
}

// dangerouslySetInnerHTML에 사용자 입력(JSON-LD reviewBody 등)이 포함되므로
// `<`를 유니코드 이스케이프하여 `</script>` 주입을 차단한다.
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function buildReviewLdNodes(reviews: OwnReview[]) {
  return reviews.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.user.name },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.content.slice(0, 200),
    datePublished: r.createdAt,
    itemReviewed: { '@type': 'Product', name: r.product.name },
  }))
}

export default async function HomePage() {
  const [products, videos, reviews] = await Promise.all([
    fetchPopularProducts(),
    fetchLatestVideos(),
    fetchLandingReviews({ pageSize: LANDING_REVIEWS_LIMIT }),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'OTTALL',
        url: 'https://ottall.com',
        description: 'OTT 공동구독 파티 매칭 플랫폼',
      },
      {
        '@type': 'WebSite',
        name: 'OTTALL',
        url: 'https://ottall.com',
      },
      ...buildReviewLdNodes(reviews),
    ],
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="w-full bg-white">
        <PublicHeader navItems={LANDING_NAV_ITEMS} />

        <div>
          <HeroSection />
          <PopularProductsSection
            products={products}
            sectionId={LANDING_SECTION_IDS.products}
          />
          <StepsSection steps={LANDING_STEPS} sectionId={LANDING_SECTION_IDS.steps} />
          <ReviewsSection reviews={reviews} sectionId={LANDING_SECTION_IDS.reviews} />
          <VideoSection videos={videos} sectionId={LANDING_SECTION_IDS.videos} />
          <TrustSection items={LANDING_TRUST_ITEMS} />
          <FaqSection faqs={LANDING_FAQS} sectionId={LANDING_SECTION_IDS.faq} />
        </div>

        <PublicFooter />
      </div>
    </main>
  )
}
