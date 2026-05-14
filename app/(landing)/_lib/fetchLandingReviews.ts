import { API_BASE_URL } from '@/constants/app'
import type { OwnReview } from '@/types/domain'

type LandingReviewsResponse = {
  data: {
    items: OwnReview[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

type FetchLandingReviewsInput = {
  pageSize: number
}

export async function fetchLandingReviews({
  pageSize,
}: FetchLandingReviewsInput): Promise<OwnReview[]> {
  try {
    const search = new URLSearchParams({
      sort: 'rating',
      page: '1',
      pageSize: String(pageSize),
    })
    const res = await fetch(`${API_BASE_URL}/own/reviews?${search.toString()}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json: LandingReviewsResponse = await res.json()
    return json.data.items
  } catch {
    return []
  }
}
