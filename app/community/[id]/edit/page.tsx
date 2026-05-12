import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { USER_BRAND_NAME } from '@/constants/app'
import { fetchCommunityPostServer } from '@/lib/communityServerApi'
import { EditPostClient } from './_components/EditPostClient'

type PageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: `게시글 수정 | ${USER_BRAND_NAME} 커뮤니티`,
  robots: { index: false, follow: false },
}

export default async function EditCommunityPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await fetchCommunityPostServer(id)
  if (!post) notFound()

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold text-text-primary">게시글 수정</h1>
      </header>
      <EditPostClient post={post} />
    </section>
  )
}
