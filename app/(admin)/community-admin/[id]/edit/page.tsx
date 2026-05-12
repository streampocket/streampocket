'use client'

import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '@/app/community/_components/PostForm'
import { useCommunityPost } from '@/app/community/_hooks/useCommunity'
import {
  uploadAdminCommunityImage,
  useAdminUpdatePost,
} from '../../_hooks/useAdminCommunity'

export default function AdminCommunityEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: post, isLoading } = useCommunityPost(params?.id)
  const updateMutation = useAdminUpdatePost()

  if (isLoading || !post) {
    return <p className="text-center text-text-muted">불러오는 중...</p>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold">게시글 수정</h1>
      </header>
      <PostForm
        showCategorySelect
        initialTitle={post.title}
        initialContent={post.content}
        initialImageUrl={post.imageUrl}
        initialCategory={post.category}
        submitLabel="수정"
        onCancel={() => router.push('/community-admin')}
        uploader={uploadAdminCommunityImage}
        onSubmit={async (payload) => {
          if (!payload.category) return
          await updateMutation.mutateAsync({
            postId: post.id,
            category: payload.category,
            title: payload.title,
            content: payload.content,
            imageUrl: payload.imageUrl,
          })
          router.push('/community-admin')
          router.refresh()
        }}
      />
    </div>
  )
}
