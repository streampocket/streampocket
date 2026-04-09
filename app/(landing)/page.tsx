import type { Metadata } from 'next'
import { FaqSection } from '@/app/(landing)/_components/FaqSection'
import { HeroSection } from '@/app/(landing)/_components/HeroSection'
import { PopularProductsSection } from '@/app/(landing)/_components/PopularProductsSection'
import { StepsSection } from '@/app/(landing)/_components/StepsSection'
import { TrustSection } from '@/app/(landing)/_components/TrustSection'
import { VideoSection } from '@/app/(landing)/_components/VideoSection'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicHeader } from '@/components/layout/PublicHeader'
import {
  LANDING_FAQS,
  LANDING_NAV_ITEMS,
  LANDING_SECTION_IDS,
  LANDING_STEPS,
  LANDING_TRUST_ITEMS,
} from '@/app/(landing)/_data'
import { API_BASE_URL, USER_BRAND_NAME } from '@/constants/app'
import { fetchLatestVideos } from '@/app/(landing)/_lib/fetchYoutubeRss'
import type { OwnProduct } from '@/types/domain'

export const metadata: Metadata = {
  title: `${USER_BRAND_NAME} | OTT 공동구독 파티 매칭 플랫폼`,
  description:
    'OTTALL(오티티올)에서 드라마박스, 웨이브, 비글루 등 OTT를 파티로 나눠 저렴하게 이용하세요.',
  keywords: ['ottall', '오티티올', 'OTT 공동구독', 'OTT 파티 매칭', '드라마박스', '웨이브', '비글루'],
  robots: { index: true, follow: true },
  openGraph: {
    title: `${USER_BRAND_NAME} | OTT 공동구독 파티 매칭 플랫폼`,
    description:
      'OTTALL(오티티올)에서 드라마박스, 웨이브, 비글루 등 OTT를 파티로 나눠 저렴하게 이용하세요.',
    url: 'https://ottall.com',
    siteName: USER_BRAND_NAME,
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${USER_BRAND_NAME} | OTT 공동구독 파티 매칭 플랫폼`,
    description:
      'OTTALL(오티티올)에서 드라마박스, 웨이브, 비글루 등 OTT를 파티로 나눠 저렴하게 이용하세요.',
  },
}

async function fetchPopularProducts(): Promise<OwnProduct[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/own/products?status=recruiting&sort=urgency&limit=4`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return []
    const json = await res.json() as { data: OwnProduct[] }
    return json.data
  } catch {
    return []
  }
}

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
  ],
}

export default async function HomePage() {
  const [products, videos] = await Promise.all([
    fetchPopularProducts(),
    fetchLatestVideos(),
  ])

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <VideoSection videos={videos} sectionId={LANDING_SECTION_IDS.videos} />
          <TrustSection items={LANDING_TRUST_ITEMS} />
          <FaqSection faqs={LANDING_FAQS} sectionId={LANDING_SECTION_IDS.faq} />
        </div>

        <PublicFooter />
      </div>
    </main>
  )
}
