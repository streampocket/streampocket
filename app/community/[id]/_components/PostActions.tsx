'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { getUserInfo } from '@/lib/userAuth'
import type { CommunityPost } from '@/types/domain'
import { useDeleteCommunityPost } from '../../_hooks/useCommunity'

type Props = {
  post: CommunityPost
}

export function PostActions({ post }: Props) {
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const deleteMutation = useDeleteCommunityPost()

  useEffect(() => {
    setCurrentUserId(getUserInfo()?.id ?? null)
  }, [])

  const isOwner =
    post.category === 'free' && post.authorType === 'user' && currentUserId === post.authorId

  if (!isOwner) return null

  async function handleDelete(): Promise<void> {
    if (!window.confirm('정말 삭제할까요?')) return
    await deleteMutation.mutateAsync(post.id)
    router.push('/community')
    router.refresh()
  }

  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-border pt-6">
      <Link href={`/community/${post.id}/edit`}>
        <Button variant="secondary" size="sm">
          수정
        </Button>
      </Link>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? '삭제 중...' : '삭제'}
      </Button>
    </div>
  )
}
