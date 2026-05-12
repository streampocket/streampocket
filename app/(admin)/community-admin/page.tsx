'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { COMMUNITY_PAGE_SIZE } from '@/constants/app'
import { formatDate } from '@/lib/utils'
import type { CommunityCategory } from '@/types/domain'
import {
  useAdminCommunityPosts,
  useAdminDeletePost,
} from './_hooks/useAdminCommunity'

export default function AdminCommunityPage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<CommunityCategory | undefined>(undefined)
  const { data, isLoading } = useAdminCommunityPosts({ page, category })
  const deleteMutation = useAdminDeletePost()

  async function handleDelete(id: string): Promise<void> {
    if (!window.confirm('정말 삭제할까요? (소프트 삭제)')) return
    await deleteMutation.mutateAsync(id)
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / COMMUNITY_PAGE_SIZE)) : 1

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-headline-md font-bold">커뮤니티 게시글 관리</h1>
          <p className="mt-1 text-caption-md text-text-secondary">
            공지/자유 게시글을 작성·수정·삭제합니다.
          </p>
        </div>
        <Link href="/community-admin/new">
          <Button>새 글 작성</Button>
        </Link>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory(undefined)
            setPage(1)
          }}
          className={
            !category
              ? 'rounded-full bg-brand px-3 py-1 text-caption-md font-semibold text-white'
              : 'rounded-full border border-border px-3 py-1 text-caption-md text-text-secondary'
          }
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory('notice')
            setPage(1)
          }}
          className={
            category === 'notice'
              ? 'rounded-full bg-brand px-3 py-1 text-caption-md font-semibold text-white'
              : 'rounded-full border border-border px-3 py-1 text-caption-md text-text-secondary'
          }
        >
          공지
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory('free')
            setPage(1)
          }}
          className={
            category === 'free'
              ? 'rounded-full bg-brand px-3 py-1 text-caption-md font-semibold text-white'
              : 'rounded-full border border-border px-3 py-1 text-caption-md text-text-secondary'
          }
        >
          자유
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="min-w-full divide-y divide-border text-caption-md">
          <thead className="bg-gray-50 text-left text-text-secondary">
            <tr>
              <th className="px-3 py-2">카테고리</th>
              <th className="px-3 py-2">제목</th>
              <th className="px-3 py-2">작성자</th>
              <th className="px-3 py-2">작성일</th>
              <th className="px-3 py-2 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-text-muted">
                  불러오는 중...
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((post) => (
                <tr key={post.id}>
                  <td className="px-3 py-2">
                    <span
                      className={
                        post.category === 'notice'
                          ? 'inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-caption-sm font-semibold text-brand'
                          : 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-caption-sm font-semibold text-text-secondary'
                      }
                    >
                      {post.category === 'notice' ? '공지' : '자유'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/community/${post.id}`} className="text-text-primary hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-text-secondary">{post.authorName}</td>
                  <td className="px-3 py-2 text-text-secondary">{formatDate(post.createdAt)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/community-admin/${post.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-text-muted">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          이전
        </Button>
        <span className="text-caption-md text-text-secondary">
          {page} / {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
