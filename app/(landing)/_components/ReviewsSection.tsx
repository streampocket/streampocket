import Link from 'next/link'
import { ReviewCard } from '@/components/own/ReviewCard'
import {
  LANDING_REVIEWS_EMPTY,
  LANDING_REVIEWS_HEADING,
  LANDING_REVIEWS_MORE_LABEL,
  LANDING_REVIEWS_SUBHEADING,
} from '@/app/(landing)/_data'
import type { OwnReview } from '@/types/domain'

type ReviewsSectionProps = {
  reviews: OwnReview[]
  sectionId: string
}

export function ReviewsSection({ reviews, sectionId }: ReviewsSectionProps) {
  return (
    <section id={sectionId} className="scroll-mt-24 bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-bold text-text-primary">{LANDING_REVIEWS_HEADING}</h2>
          <p className="mt-2 text-sm font-medium text-text-secondary">
            {LANDING_REVIEWS_SUBHEADING}
          </p>
        </header>

        {reviews.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-gray-50 py-16 text-center text-sm font-medium text-text-secondary">
            {LANDING_REVIEWS_EMPTY}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                {LANDING_REVIEWS_MORE_LABEL}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
