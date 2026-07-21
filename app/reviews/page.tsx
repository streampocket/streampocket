import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import {
  REVIEW_PAGE_SIZE,
  USER_BRAND_NAME,
  USER_SITE_URL,
} from '@/constants/app'
import {
  fetchOwnCategoriesServer,
  fetchOwnProductsLiteServer,
  fetchReviewsServer,
} from '@/lib/reviewServerApi'
import { ReviewCard } from '@/components/own/ReviewCard'
import { ReviewFilters } from './_components/ReviewFilters'
import { ReviewPagination } from './_components/ReviewPagination'

type SearchParams = {
  productId?: string
  categoryId?: string
  sort?: string
  page?: string
}

type ReviewsPageProps = {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: ReviewsPageProps): Promise<Metadata> {
  const sp = await searchParams
  const titleBase = `파티원 리뷰 | ${USER_BRAND_NAME}`
  const description = sp.categoryId
    ? `${USER_BRAND_NAME} 파티원이 직접 남긴 OTT 이용 후기를 확인하세요.`
    : `${USER_BRAND_NAME}에서 OTT 파티에 참여한 회원들이 남긴 별점과 후기를 모아보세요.`
  return {
    title: titleBase,
    description,
    // 필터·페이지·utm 쿼리 변형 주소를 대표 주소 하나로 통합 (중복 색인 방지)
    alternates: { canonical: `${USER_SITE_URL}/reviews` },
    openGraph: { title: titleBase, description },
  }
}

function normalizeSort(value: string | undefined): 'latest' | 'rating' {
  return value === 'rating' ? 'rating' : 'latest'
}

function normalizePage(value: string | undefined): number {
  const n = Number.parseInt(value ?? '', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const sp = await searchParams
  const sort = normalizeSort(sp.sort)
  const page = normalizePage(sp.page)
  const categoryId = sp.categoryId || undefined
  const productId = sp.productId || undefined

  const [list, categories, products] = await Promise.all([
    fetchReviewsServer({ categoryId, productId, sort, page, pageSize: REVIEW_PAGE_SIZE }),
    fetchOwnCategoriesServer(),
    fetchOwnProductsLiteServer(categoryId),
  ])

  function buildHref(nextPage: number): string {
    const params = new URLSearchParams()
    if (categoryId) params.set('categoryId', categoryId)
    if (productId) params.set('productId', productId)
    if (sort !== 'latest') params.set('sort', sort)
    if (nextPage > 1) params.set('page', String(nextPage))
    const qs = params.toString()
    return `/reviews${qs ? `?${qs}` : ''}`
  }

  return (
    <section className="space-y-6 py-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-display text-text-primary">파티원 리뷰</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            실제 파티에 참여한 {USER_BRAND_NAME} 회원이 남긴 별점과 후기예요.
          </p>
        </div>
        <Link href="/reviews/new">
          <Button variant="primary">리뷰 작성하기</Button>
        </Link>
      </header>

      <ReviewFilters
        categories={categories}
        products={products}
        currentCategoryId={categoryId}
        currentProductId={productId}
        currentSort={sort}
      />

      {list.items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card-bg py-20 text-center text-body-md text-text-muted">
          아직 등록된 리뷰가 없어요.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewPagination page={list.page} totalPages={list.totalPages} buildHref={buildHref} />
    </section>
  )
}
