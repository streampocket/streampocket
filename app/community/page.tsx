import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { COMMUNITY_PAGE_SIZE, USER_BRAND_NAME, USER_SITE_URL } from '@/constants/app'
import { fetchCommunityPostsServer } from '@/lib/communityServerApi'
import type { CommunityCategory } from '@/types/domain'
import { Pagination } from './_components/Pagination'
import { PostCard } from './_components/PostCard'

type SearchParams = {
  page?: string
  category?: string
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const title = sp.category === 'notice' ? `공지사항 | ${USER_BRAND_NAME}` : `커뮤니티 | ${USER_BRAND_NAME}`
  const description = `${USER_BRAND_NAME} 회원 커뮤니티 — 공지사항과 자유 게시글을 확인하세요.`
  return {
    title,
    description,
    // 카테고리·페이지·utm 쿼리 변형 주소를 대표 주소 하나로 통합 (중복 색인 방지)
    alternates: { canonical: `${USER_SITE_URL}/community` },
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

function parseCategory(value: string | undefined): CommunityCategory | undefined {
  return value === 'notice' || value === 'free' ? value : undefined
}

function parsePage(value: string | undefined): number {
  const n = Number.parseInt(value ?? '', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

export default async function CommunityPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const page = parsePage(sp.page)
  const category = parseCategory(sp.category)
  const data = await fetchCommunityPostsServer({ page, category })

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-end justify-between gap-2">
        <div>
          <h1 className="text-headline-md font-bold text-text-primary">커뮤니티</h1>
          <p className="mt-1 text-caption-md text-text-secondary">
            공지사항과 자유 게시글을 모아 보세요.
          </p>
        </div>
        <Link href="/community/new">
          <Button size="sm">글쓰기</Button>
        </Link>
      </header>

      <nav className="mb-4 flex gap-2 text-caption-md">
        <Link
          href="/community"
          className={
            !category
              ? 'rounded-full bg-brand px-3 py-1 font-semibold text-white'
              : 'rounded-full border border-border bg-white px-3 py-1 text-text-secondary hover:border-brand'
          }
        >
          전체
        </Link>
        <Link
          href="/community?category=notice"
          className={
            category === 'notice'
              ? 'rounded-full bg-brand px-3 py-1 font-semibold text-white'
              : 'rounded-full border border-border bg-white px-3 py-1 text-text-secondary hover:border-brand'
          }
        >
          공지
        </Link>
        <Link
          href="/community?category=free"
          className={
            category === 'free'
              ? 'rounded-full bg-brand px-3 py-1 font-semibold text-white'
              : 'rounded-full border border-border bg-white px-3 py-1 text-text-secondary hover:border-brand'
          }
        >
          자유
        </Link>
      </nav>

      <section className="space-y-3">
        {data.pinnedNotices.length > 0 ? (
          <div className="space-y-3">
            {data.pinnedNotices.map((post) => (
              <PostCard key={`pinned-${post.id}`} post={post} />
            ))}
            <hr className="border-border" />
          </div>
        ) : null}
        {data.items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-white py-12 text-center text-text-muted">
            아직 게시글이 없어요.
          </p>
        ) : (
          data.items.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

      <Pagination
        page={page}
        pageSize={COMMUNITY_PAGE_SIZE}
        total={data.total}
        basePath="/community"
        searchParams={{ category }}
      />
    </section>
  )
}
