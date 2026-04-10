import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { LANDING_SECTION_IDS } from '@/app/(landing)/_data'

export function HeroSection() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="max-w-4xl space-y-5">
          <Badge variant="purple" className="rounded-full px-3 py-1 text-xs font-bold">
            안전한 OTT 공동구독 플랫폼
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.03em] text-text-primary sm:text-5xl">
              믿을 수 있는 숏폼드라마 OTT 파티 매칭, OTTALL
            </h1>
            <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              모집 중인 파티를 확인하고 바로 참여하세요. 매칭부터 정산까지
              플랫폼이 관리합니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`#${LANDING_SECTION_IDS.products}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-bold text-text-primary transition-colors hover:bg-gray-50"
            >
              파티 둘러보기
            </Link>
            <Link
              href={`#${LANDING_SECTION_IDS.steps}`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              이용 방법 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
