import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { KAKAO_OPEN_CHAT_URL } from '@/constants/app'
import { LANDING_SECTION_IDS } from '@/app/(landing)/_data'

export function HeroSection() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="max-w-4xl space-y-5">
          <Badge variant="purple" className="rounded-full px-3 py-1 text-xs font-bold">
            2인·3인 파티 모집형 OTT 플랫폼
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.03em] text-text-primary sm:text-5xl">
              모집 중인 파티를 보고 바로 참여하는 OTT 이용 플랫폼
            </h1>
            <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              계정 판매형이 아니라 파티 매칭형 구조입니다. 로그인 후 참여하고,
              회원가입은 로그인 페이지에서 진행합니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`#${LANDING_SECTION_IDS.products}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-bold text-text-primary transition-colors hover:bg-gray-50"
            >
              상품 전체 보기
            </Link>
            <Link
              href={KAKAO_OPEN_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              카카오톡 문의
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
