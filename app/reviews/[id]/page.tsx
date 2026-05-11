import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { USER_BRAND_NAME } from '@/constants/app'
import { fetchReviewServer } from '@/lib/reviewServerApi'
import { formatDate } from '@/lib/utils'
import { ReviewOwnerActions } from '../_components/ReviewOwnerActions'
import { StarRating } from '../_components/StarRating'

type DetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params
  const review = await fetchReviewServer(id).catch(() => null)
  if (!review) {
    return { title: `리뷰 | ${USER_BRAND_NAME}` }
  }
  const title = `${review.product.name} 리뷰 | ${USER_BRAND_NAME}`
  const description = review.content.replace(/\s+/g, ' ').slice(0, 120)
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(review.imageUrl ? { images: [{ url: review.imageUrl }] } : {}),
    },
  }
}

export default async function ReviewDetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const review = await fetchReviewServer(id)
  if (!review) notFound()

  return (
    <article className="mx-auto max-w-3xl space-y-5 py-4">
      <Link href="/reviews" className="text-caption-md font-semibold text-brand hover:underline">
        ← 리뷰 목록으로
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="purple">{review.product.category.name}</Badge>
          <span className="text-caption-sm text-text-muted">
            {formatDate(review.createdAt)} 작성
          </span>
        </div>
        <h1 className="text-display text-text-primary">{review.product.name}</h1>
        <div className="flex items-center gap-2">
          <StarRating value={review.rating} size="lg" />
          <span className="text-heading-md text-text-primary">{review.rating.toFixed(1)}</span>
        </div>
      </header>

      <Card>
        <CardBody className="space-y-5">
          {review.imageUrl ? (
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={review.imageUrl}
                alt={`${review.product.name} 리뷰 이미지`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <p className="whitespace-pre-line text-body-lg text-text-primary">{review.content}</p>
        </CardBody>
        <CardFooter className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-caption-md font-bold text-brand"
            >
              {review.user.name.slice(0, 1)}
            </span>
            <div>
              <div className="text-caption-md font-semibold text-text-primary">{review.user.name}</div>
              <div className="text-caption-sm text-text-muted">파티 확정 멤버</div>
            </div>
          </div>
          <ReviewOwnerActions reviewId={review.id} authorId={review.userId} />
        </CardFooter>
      </Card>
    </article>
  )
}
