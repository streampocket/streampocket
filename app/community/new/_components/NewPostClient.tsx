'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { USER_LOGIN_PATH } from '@/constants/app'
import { isUserAuthenticated } from '@/lib/userAuth'
import { PostForm } from '../../_components/PostForm'
import { useCreateCommunityPost } from '../../_hooks/useCommunity'

export function NewPostClient() {
  const router = useRouter()
  const createMutation = useCreateCommunityPost()

  useEffect(() => {
    if (!isUserAuthenticated()) {
      router.replace(`${USER_LOGIN_PATH}?next=/community/new`)
    }
  }, [router])

  return (
    <PostForm
      submitLabel="게시"
      onCancel={() => router.push('/community')}
      onSubmit={async (payload) => {
        const created = await createMutation.mutateAsync({
          title: payload.title,
          content: payload.content,
          imageUrl: payload.imageUrl,
        })
        router.push(`/community/${created.id}`)
        router.refresh()
      }}
    />
  )
}
