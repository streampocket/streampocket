import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cache } from 'react'
import { USER_BRAND_NAME, USER_OG_IMAGE, USER_SITE_URL } from '@/constants/app'
import { findOttBySlug, OTT_CATALOG, type OttCatalogEntry } from '@/constants/ottCatalog'
import {
  fetchOwnCategoriesForListServer,
  fetchOwnProductsServer,
} from '@/lib/ownProductServerApi'
import { fetchReviewsServer } from '@/lib/reviewServerApi'
import { OwnProductCard } from '@/app/party/_components/OwnProductCard'
import { ReviewCard } from '@/components/own/ReviewCard'
import type { OwnProduct, OwnReview } from '@/types/domain'

const REVIEW_PREVIEW_COUNT = 5

type PageProps = {
  params: Promise<{ slug: string }>
}

/** 랜딩에 노출할 후기 개수만큼만 받는다 */
type LandingData = {
  products: OwnProduct[]
  reviews: OwnReview[]
}

/**
 * slug → 이 OTT의 모집중 파티 + 후기.
 *
 * 파티 목록 API는 `categoryId`(uuid)만 받고 uuid는 빌드 타임에 알 수 없어,
 * 카테고리 목록을 받아 라벨로 매칭한다. 카테고리는 파티명으로 자동 생성되고
 * (be의 `resolveCategoryByName`) 파티 수정 폼에서 이름을 자유롭게 고칠 수 있어
 * **같은 OTT에 카테고리가 여러 개 있을 수 있다** — 전부 모아 합친다.
 *
 * `generateMetadata`와 본문이 같은 데이터를 쓰므로 `cache()`로 요청 내 dedupe한다.
 */
const fetchLandingData = cache(async (ott: OttCatalogEntry): Promise<LandingData> => {
  const categories = await fetchOwnCategoriesForListServer()
  const normalized = ott.label.replace(/\s+/g, '')
  const categoryIds = categories
    .filter((category) => category.name.replace(/\s+/g, '') === normalized)
    .map((category) => category.id)

  if (categoryIds.length === 0) return { products: [], reviews: [] }

  const [productLists, reviewLists] = await Promise.all([
    Promise.all(
      categoryIds.map((categoryId) =>
        fetchOwnProductsServer({ categoryId, status: 'recruiting' }),
      ),
    ),
    Promise.all(
      categoryIds.map((categoryId) =>
        fetchReviewsServer({ categoryId, page: 1, pageSize: REVIEW_PREVIEW_COUNT })
          .then((list) => list.items)
          .catch(() => []),
      ),
    ),
  ])

  return {
    // 가격이 낮은 파티를 먼저 보여준다 (현재가는 차감형에서 남은 기간만큼 깎인다)
    products: productLists.flat().sort((a, b) => a.currentPrice - b.currentPrice),
    reviews: reviewLists.flat().slice(0, REVIEW_PREVIEW_COUNT),
  }
})

function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

/** 모집중 파티의 최저 현재가 — 없으면 제목·설명에서 가격 문구를 뺀다 */
function lowestPrice(products: OwnProduct[]): number | null {
  if (products.length === 0) return null
  return Math.min(...products.map((p) => p.currentPrice))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const ott = findOttBySlug(slug)
  if (!ott) return { title: '찾을 수 없는 페이지' }

  const { products } = await fetchLandingData(ott)
  const from = lowestPrice(products)

  // 한글·영문을 함께 넣어 "드라마 웨이브", "dramawave" 양쪽 검색어를 받는다
  const nameWithEn = `${ott.label} (${ott.en})`
  const pageTitle = from
    ? `${nameWithEn} 파티 월 ${formatPrice(from)}원부터`
    : `${nameWithEn} 파티 공동구매`
  // meta description은 summary를 쓴다 — description을 그대로 쓰면 400자가 넘어
  // 검색결과에서 뒤가 잘린다(구글 ~155자). 긴 소개는 페이지 본문에 그대로 렌더되므로
  // 콘텐츠로는 손실이 없다. JSON-LD의 description은 길이 제약이 없어 원문을 유지한다.
  const description = from
    ? `${ott.summary} 지금 모집중인 파티는 월 ${formatPrice(from)}원부터 참여할 수 있습니다.`
    : ott.summary

  return {
    title: pageTitle,
    description,
    keywords: [
      ott.label,
      ott.en,
      `${ott.label} 파티`,
      `${ott.label} 공유`,
      `${ott.label} 공동구매`,
      '숏폼 드라마',
      'OTT 파티',
    ],
    alternates: { canonical: `${USER_SITE_URL}/ott/${ott.slug}` },
    openGraph: {
      type: 'website',
      title: `${pageTitle} | ${USER_BRAND_NAME}`,
      description,
      url: `${USER_SITE_URL}/ott/${ott.slug}`,
      siteName: USER_BRAND_NAME,
      locale: 'ko_KR',
      images: [ott.imagePath ? { url: `${USER_SITE_URL}${ott.imagePath}` } : USER_OG_IMAGE],
    },
    twitter: {
      // OTT 로고는 정사각이라 소형 카드가 규격에 맞다 (파티 상세와 같은 판단)
      card: ott.imagePath ? 'summary' : 'summary_large_image',
      title: `${pageTitle} | ${USER_BRAND_NAME}`,
      description,
      images: [ott.imagePath ? `${USER_SITE_URL}${ott.imagePath}` : USER_OG_IMAGE],
    },
  }
}

/** 7종 고정이라 미리 알려준다 — 없는 slug는 notFound로 떨어진다 */
export function generateStaticParams() {
  return OTT_CATALOG.map((ott) => ({ slug: ott.slug }))
}

export default async function OttLandingPage({ params }: PageProps) {
  const { slug } = await params
  const ott = findOttBySlug(slug)
  if (!ott) notFound()

  const { products, reviews } = await fetchLandingData(ott)
  const from = lowestPrice(products)
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${ott.label} (${ott.en}) 파티`,
    description: ott.description,
    image: `${USER_SITE_URL}${ott.imagePath}`,
    brand: { '@type': 'Brand', name: USER_BRAND_NAME },
    ...(from
      ? {
          offers: {
            '@type': 'Offer',
            price: from,
            priceCurrency: 'KRW',
            availability: 'https://schema.org/InStock',
            url: `${USER_SITE_URL}/ott/${ott.slug}`,
          },
        }
      : {}),
    ...(averageRating && reviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(averageRating.toFixed(1)),
            reviewCount: reviews.length,
          },
        }
      : {}),
  }

  return (
    <section className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 소개 — 모집중 파티가 없을 때 이 문구가 페이지의 실질 콘텐츠가 된다 */}
      <header className="space-y-2">
        <h1 className="text-heading-lg text-text-primary">
          {ott.label} ({ott.en}) 파티
        </h1>
        <p className="text-body-lg font-medium text-text-secondary">{ott.tagline}</p>
        <p className="text-body-md text-text-secondary">{ott.description}</p>
      </header>

      {/* 지금 모집중 */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-heading-sm text-text-primary">지금 모집중인 파티</h2>
          {from !== null && (
            <span className="text-body-md text-text-secondary">
              월 {formatPrice(from)}원부터
            </span>
          )}
        </div>

        {products.length === 0 ? (
          <div className="space-y-3 rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-body-md text-text-secondary">
              지금은 모집중인 {ott.label} 파티가 없습니다. 새 파티가 열리면 바로 참여할 수 있습니다.
            </p>
            <Link
              href="/party"
              className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-body-md font-medium text-white transition-opacity hover:opacity-90"
            >
              다른 파티 보기
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <OwnProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 이용 후기 — 쌓이는 콘텐츠라 페이지가 시간이 갈수록 두꺼워진다 */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-heading-sm text-text-primary">{ott.label} 이용 후기</h2>
            <Link href="/reviews" className="text-body-md text-brand hover:underline">
              후기 더보기
            </Link>
          </div>
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* 이용 안내 */}
      <div className="space-y-2 rounded-lg border border-border p-4">
        <h2 className="text-heading-sm text-text-primary">이용 안내</h2>
        <ul className="list-disc space-y-1 pl-5 text-body-md text-text-secondary">
          <li>파티에 참여하면 관리자가 계정을 배정하고 로그인 정보를 안내합니다.</li>
          <li>로그인에 필요한 인증번호는 마이페이지에서 직접 발급받을 수 있습니다.</li>
          <li>기간 차감형 파티는 남은 기간만큼 금액이 할인되어 중간에도 참여할 수 있습니다.</li>
        </ul>
      </div>

      {/* 다른 OTT — 랜딩끼리 연결해 크롤 경로를 만든다 */}
      <nav aria-label="다른 OTT 보기" className="flex flex-wrap items-center gap-2">
        <span className="text-body-md text-text-secondary">다른 OTT</span>
        {OTT_CATALOG.filter((other) => other.slug !== ott.slug).map((other) => (
          <Link
            key={other.slug}
            href={`/ott/${other.slug}`}
            className="rounded-full bg-gray-100 px-3 py-1 text-caption-md font-medium text-text-secondary transition-colors hover:bg-gray-200"
          >
            {other.label}
          </Link>
        ))}
      </nav>
    </section>
  )
}
