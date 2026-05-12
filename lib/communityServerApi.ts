import { API_BASE_URL } from '@/constants/app'
import type { CommunityCategory, CommunityPost, CommunityPostListResponse } from '@/types/domain'

type SitemapResponse = {
  items: { id: string; updatedAt: string }[]
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export type CommunityListServerParams = {
  page?: number
  category?: CommunityCategory
}

export async function fetchCommunityPostsServer(
  params: CommunityListServerParams,
): Promise<CommunityPostListResponse> {
  const qs = buildQuery(params)
  const res = await fetch(`${API_BASE_URL}/community/posts${qs}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('게시글 목록을 불러오지 못했습니다.')
  }
  return res.json()
}

export async function fetchCommunityPostServer(id: string): Promise<CommunityPost | null> {
  const res = await fetch(`${API_BASE_URL}/community/posts/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error('게시글을 불러오지 못했습니다.')
  }
  return res.json()
}

export async function fetchCommunityPostIdsServer(): Promise<SitemapResponse> {
  const res = await fetch(`${API_BASE_URL}/community/posts/sitemap`, { cache: 'no-store' })
  if (!res.ok) return { items: [] }
  return res.json()
}
