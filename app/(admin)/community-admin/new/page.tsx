'use client'

import { useRouter } from 'next/navigation'
import { PostForm } from '@/app/community/_components/PostForm'
import {
  uploadAdminCommunityImage,
  useAdminCreatePost,
} from '../_hooks/useAdminCommunity'

export default function AdminCommunityNewPage() {
  const router = useRouter()
  const createMutation = useAdminCreatePost()

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold">새 게시글 작성</h1>
        <p className="mt-1 text-caption-md text-text-secondary">
          공지 또는 자유 카테고리로 작성합니다.
        </p>
      </header>
      <PostForm
        showCategorySelect
        initialCategory="notice"
        submitLabel="게시"
        onCancel={() => router.push('/community-admin')}
        uploader={uploadAdminCommunityImage}
        onSubmit={async (payload) => {
          if (!payload.category) return
          await createMutation.mutateAsync({
            category: payload.category,
            title: payload.title,
            content: payload.content,
            imageUrl: payload.imageUrl,
            isPinned: payload.isPinned ?? false,
          })
          router.push('/community-admin')
          router.refresh()
        }}
      />
    </div>
  )
}
