import type { MetadataRoute } from 'next'
import { API_BASE_URL, USER_SITE_URL } from '@/constants/app'
import { OTT_CATALOG } from '@/constants/ottCatalog'

type SitemapItem = {
  id: string
  updatedAt: string
}

type PartySitemapItem = SitemapItem & {
  status: 'recruiting' | 'closed' | 'expired'
}

/**
 * 파티 전체(마감·만료 포함)를 sitemap에 넣는다.
 *
 * 2026-08에 마감 파티를 noindex로 돌리고 sitemap에서도 뺐더니, 파티가 정원이 차서
 * 재생성되는 구조(월 ~900개) 때문에 색인된 페이지가 계속 빠져나갔다. 마감 파티도
 * 페이지가 살아 있고(모집 마감 안내 + 모집중 보기 버튼) 검색 유입 창구로 쓰이므로,
 * 재크롤 경로를 열어두려면 sitemap에 있어야 한다.
 *
 * `/own/products`(전체 필드 + category)는 응답이 3MB에 달해 sitemap 전용 경량
 * 엔드포인트를 쓴다. be 배포가 늦어 404가 오면 파티 URL이 통째로 사라지므로
 * 기존 엔드포인트로 폴백한다.
 */
async function fetchPartyItems(): Promise<PartySitemapItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/own/products/sitemap`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const json = (await res.json()) as { items: PartySitemapItem[] }
      return json.items
    }
  } catch {
    // 아래 폴백으로 넘어간다
  }

  // 폴백: 경량 엔드포인트가 아직 배포되지 않은 경우 (fe가 be보다 먼저 뜬 상황)
  try {
    const res = await fetch(`${API_BASE_URL}/own/products`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = (await res.json()) as {
      data: { id: string; status: PartySitemapItem['status']; updatedAt: string }[]
    }
    return json.data.map((p) => ({ id: p.id, status: p.status, updatedAt: p.updatedAt }))
  } catch {
    return []
  }
}

async function fetchReviewItems(): Promise<SitemapItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/own/reviews/sitemap`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { items: SitemapItem[] }
    return json.items
  } catch {
    return []
  }
}

async function fetchCommunityPostItems(): Promise<SitemapItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/community/posts/sitemap`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { items: SitemapItem[] }
    return json.items
  } catch {
    return []
  }
}

/** 잘못된 날짜 문자열이 sitemap 전체를 깨뜨리지 않게 한다 */
function toDate(value: string): Date {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = USER_SITE_URL

  // /signin은 얇은 로그인 페이지라, /guide는 스팀 코드 등록 안내(OTT와 무관)라 제외한다
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/party`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  // OTT 대표 페이지 — 파티가 재생성돼도 주소가 바뀌지 않는 안정 색인 대상
  const ottPages: MetadataRoute.Sitemap = OTT_CATALOG.map((ott) => ({
    url: `${baseUrl}/ott/${ott.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const [parties, reviews, communityPosts] = await Promise.all([
    fetchPartyItems(),
    fetchReviewItems(),
    fetchCommunityPostItems(),
  ])

  // 모집중은 내용이 자주 바뀌고 전환 가치가 높아 크롤 우선순위를 높게 준다
  const partyPages: MetadataRoute.Sitemap = parties.map((party) => ({
    url: `${baseUrl}/party/${party.id}`,
    lastModified: toDate(party.updatedAt),
    changeFrequency: party.status === 'recruiting' ? ('daily' as const) : ('monthly' as const),
    priority: party.status === 'recruiting' ? 0.7 : 0.4,
  }))

  const reviewPages: MetadataRoute.Sitemap = reviews.map((review) => ({
    url: `${baseUrl}/reviews/${review.id}`,
    lastModified: toDate(review.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const communityPages: MetadataRoute.Sitemap = communityPosts.map((post) => ({
    url: `${baseUrl}/community/${post.id}`,
    lastModified: toDate(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...ottPages, ...partyPages, ...reviewPages, ...communityPages]
}
