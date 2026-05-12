import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { NewPostClient } from './_components/NewPostClient'

export const metadata: Metadata = {
  title: `글쓰기 | ${USER_BRAND_NAME} 커뮤니티`,
  description: '자유 게시판에 새 글을 작성합니다.',
  robots: { index: false, follow: false },
}

export default function NewCommunityPostPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-headline-md font-bold text-text-primary">새 글 작성</h1>
        <p className="mt-1 text-caption-md text-text-secondary">자유 게시글을 작성합니다.</p>
      </header>
      <NewPostClient />
    </section>
  )
}
