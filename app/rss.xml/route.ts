import { USER_BRAND_NAME, USER_SITE_URL } from '@/constants/app'
import { fetchReviewsServer } from '@/lib/reviewServerApi'
import { fetchCommunityPostsServer } from '@/lib/communityServerApi'

/**
 * RSS 피드 — 네이버 서치어드바이저 `요청 → RSS 제출`에 넣는 주소.
 *
 * 네이버는 RSS로 새 글을 sitemap보다 빨리 발견한다. 이 사이트 검색 유입의 89%가 네이버라
 * 발견 경로를 하나 더 두는 값어치가 있다.
 *
 * **파티는 담지 않는다** — 정원이 차면 며칠~몇 주 만에 마감되어 색인 가치가 짧고,
 * 이미 sitemap에서 `changeFrequency: daily`로 커버된다. 대신 사라지지 않는 콘텐츠인
 * 리뷰(회원 작성)와 커뮤니티 글을 담는다. 검색 롱테일도 이쪽에서 나온다.
 */

/** 크롤러가 드물게 호출하므로 1시간 캐시면 충분하다 */
export const revalidate = 3600

const FEED_ITEM_LIMIT = 30
/** 각 출처에서 받아올 개수 — 합쳐서 최신순으로 자르므로 넉넉히 받는다 */
const SOURCE_FETCH_SIZE = 20
/** RSS 설명문 길이 — 본문 전체를 넣으면 피드가 비대해진다 */
const DESCRIPTION_LENGTH = 200

type FeedItem = {
  title: string
  link: string
  description: string
  /** ISO 문자열 */
  publishedAt: string
}

/** XML 특수문자 이스케이프 — 리뷰·게시글 본문에 `&`나 `<`가 그대로 들어올 수 있다 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** 줄바꿈·연속 공백을 정리하고 길이를 자른다 */
function toSummary(content: string): string {
  const flat = content.replace(/\s+/g, ' ').trim()
  return flat.length > DESCRIPTION_LENGTH ? `${flat.slice(0, DESCRIPTION_LENGTH)}…` : flat
}

/** 잘못된 날짜가 피드 전체를 깨뜨리지 않게 한다 */
function toRfc822(value: string): string {
  const date = new Date(value)
  return (Number.isNaN(date.getTime()) ? new Date() : date).toUTCString()
}

/**
 * 리뷰 항목.
 *
 * `fetchReviewsServer`는 실패 시 예외를 던진다 — 그대로 두면 API가 잠깐 흔들릴 때
 * 피드가 500을 내고, 크롤러가 그 상태를 보면 피드를 죽은 것으로 취급한다.
 * 빈 배열로 떨어뜨려 피드 자체는 정상 응답하게 한다.
 */
async function fetchReviewItems(): Promise<FeedItem[]> {
  try {
    const list = await fetchReviewsServer({ page: 1, pageSize: SOURCE_FETCH_SIZE })
    return list.items.map((review) => ({
      title: `${review.product.name} 파티 후기 (별점 ${review.rating}점)`,
      link: `${USER_SITE_URL}/reviews/${review.id}`,
      description: toSummary(review.content),
      publishedAt: review.createdAt,
    }))
  } catch {
    return []
  }
}

/** 커뮤니티 항목. `fetchCommunityPostsServer`도 실패 시 예외를 던져 같은 처리를 한다 */
async function fetchCommunityItems(): Promise<FeedItem[]> {
  try {
    const list = await fetchCommunityPostsServer({ page: 1 })
    return list.items.map((post) => ({
      title: post.title,
      link: `${USER_SITE_URL}/community/${post.id}`,
      description: toSummary(post.content),
      publishedAt: post.createdAt,
    }))
  } catch {
    return []
  }
}

function renderItem(item: FeedItem): string {
  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRfc822(item.publishedAt)}</pubDate>
    </item>`
}

export async function GET(): Promise<Response> {
  const [reviews, posts] = await Promise.all([fetchReviewItems(), fetchCommunityItems()])

  const items = [...reviews, ...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, FEED_ITEM_LIMIT)

  const feedTitle = `${USER_BRAND_NAME} 최신 글`
  const feedDescription = `${USER_BRAND_NAME} 파티원 후기와 커뮤니티 글`
  // 항목이 없어도 채널 자체는 내보낸다 — 빈 피드가 500보다 낫다
  const lastBuildDate = (items[0] ? new Date(items[0].publishedAt) : new Date()).toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${USER_SITE_URL}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${USER_SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items.map(renderItem).join('\n')}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // 크롤러가 CDN 캐시를 타도록 — revalidate와 같은 주기
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
