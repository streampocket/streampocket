'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserInfo, isUserAuthenticated } from '@/lib/userAuth'
import type { CommunityPost } from '@/types/domain'
import { PostForm } from '../../../_components/PostForm'
import { useUpdateCommunityPost } from '../../../_hooks/useCommunity'

type Props = {
  post: CommunityPost
}

export function EditPostClient({ post }: Props) {
  const router = useRouter()
  const updateMutation = useUpdateCommunityPost()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isUserAuthenticated()) {
      router.replace(`/community/${post.id}`)
      return
    }
    const currentId = getUserInfo()?.id ?? null
    const canEdit =
      post.category === 'free' && post.authorType === 'user' && currentId === post.authorId
    if (!canEdit) {
      router.replace(`/community/${post.id}`)
      return
    }
    setReady(true)
  }, [post, router])

  if (!ready) {
    return <p className="text-center text-text-muted">권한 확인 중...</p>
  }

  return (
    <PostForm
      initialTitle={post.title}
      initialContent={post.content}
      initialImageUrl={post.imageUrl}
      submitLabel="수정"
      onCancel={() => router.push(`/community/${post.id}`)}
      onSubmit={async (payload) => {
        await updateMutation.mutateAsync({
          postId: post.id,
          title: payload.title,
          content: payload.content,
          imageUrl: payload.imageUrl,
        })
        router.push(`/community/${post.id}`)
        router.refresh()
      }}
    />
  )
}
