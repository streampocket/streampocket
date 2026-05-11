import Image from 'next/image'
import Link from 'next/link'
import { Card, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateOnly } from '@/lib/utils'
import type { OwnReview } from '@/types/domain'
import { StarRating } from './StarRating'

type ReviewCardProps = {
  review: OwnReview
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/reviews/${review.id}`} aria-label={`${review.product.name} 리뷰 자세히 보기`}>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-16/10 w-full bg-gray-100">
          {review.imageUrl ? (
            <Image
              src={review.imageUrl}
              alt={`${review.product.name} 리뷰 이미지`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-light to-indigo-100 text-caption-sm text-text-secondary">
              이미지 없음
            </div>
          )}
        </div>

        <CardBody className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple">{review.product.category.name}</Badge>
            <span className="text-caption-sm text-text-muted">{formatDateOnly(review.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <StarRating value={review.rating} size="sm" />
            <span className="text-caption-md font-semibold text-text-primary">
              {review.rating.toFixed(1)}
            </span>
          </div>
          <div className="text-heading-sm text-text-primary">{review.product.name}</div>
          <p className="line-clamp-3 text-body-md text-text-secondary">{review.content}</p>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <span className="text-caption-sm text-text-muted">{review.user.name}</span>
          <span className="text-caption-md font-semibold text-brand">자세히 보기 →</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
