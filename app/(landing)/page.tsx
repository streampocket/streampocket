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
  LANDING_PRODUCTS,
  LANDING_SECTION_IDS,
  LANDING_STEPS,
  LANDING_TRUST_ITEMS,
  LANDING_VIDEOS,
} from '@/app/(landing)/_data'
import { BRAND_NAME } from '@/constants/app'

export const metadata: Metadata = {
  title: `${BRAND_NAME} | OTT 파티 공유 플랫폼`,
  description: '모집 중인 파티를 보고 바로 참여하는 OTT 이용 플랫폼입니다.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full bg-white">
        <PublicHeader navItems={LANDING_NAV_ITEMS} />

        <div>
          <HeroSection />
          <PopularProductsSection
            products={LANDING_PRODUCTS}
            sectionId={LANDING_SECTION_IDS.products}
          />
          <StepsSection steps={LANDING_STEPS} sectionId={LANDING_SECTION_IDS.steps} />
          <VideoSection videos={LANDING_VIDEOS} sectionId={LANDING_SECTION_IDS.videos} />
          <TrustSection items={LANDING_TRUST_ITEMS} />
          <FaqSection faqs={LANDING_FAQS} sectionId={LANDING_SECTION_IDS.faq} />
        </div>

        <PublicFooter />
      </div>
    </main>
  )
}
