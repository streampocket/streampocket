import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { USER_BRAND_NAME, USER_OG_IMAGE, USER_SITE_URL } from '@/constants/app'
import { fetchCommunityPostServer } from '@/lib/communityServerApi'
import { formatDate } from '@/lib/utils'
import { MarkdownRenderer } from '../_components/MarkdownRenderer'
import { PostActions } from './_components/PostActions'

type PageProps = {
  params: Promise<{ id: string }>
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = await fetchCommunityPostServer(id)
  if (!post) {
    return { title: '게시글을 찾을 수 없습니다' }
  }
  const description = stripMarkdown(post.content).slice(0, 160)
  const title = `${post.title} | ${USER_BRAND_NAME} 커뮤니티`
  // openGraph를 선언한 페이지는 대표 OG 이미지를 상속받지 못하므로 폴백을 직접 지정한다
  const images = [post.imageUrl ? { url: post.imageUrl } : USER_OG_IMAGE]
  return {
    title,
    description,
    alternates: { canonical: `${USER_SITE_URL}/community/${post.id}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      images,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      // 첨부 사진도 대표 OG 폴백도 모두 가로형이라 큰 카드가 맞다
      card: 'summary_large_image',
      title: post.title,
      description,
      images,
    },
  }
}

export default async function CommunityPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await fetchCommunityPostServer(id)
  if (!post) notFound()

  const description = stripMarkdown(post.content).slice(0, 160)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    image: post.imageUrl ? [post.imageUrl] : undefined,
    author: { '@type': 'Person', name: post.authorName },
    publisher: { '@type': 'Organization', name: USER_BRAND_NAME },
  }

  const isNotice = post.category === 'notice'

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        // 단언 사유: JSON-LD 직렬화를 위한 dangerouslySetInnerHTML 패턴
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-4">
        <Link href="/community" className="text-caption-md text-brand hover:underline">
          ← 커뮤니티로
        </Link>
      </div>

      <article>
        <header className="mb-6 space-y-3 border-b border-border pb-6">
          <div>
            <span
              className={
                isNotice
                  ? 'inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-caption-sm font-semibold text-brand'
                  : 'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-caption-sm font-semibold text-text-secondary'
              }
            >
              {isNotice ? '공지' : '자유'}
            </span>
          </div>
          <h1 className="text-headline-md font-bold text-text-primary">{post.title}</h1>
          <div className="flex items-center gap-2 text-caption-md text-text-muted">
            <span>{post.authorName}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            {post.createdAt !== post.updatedAt ? (
              <span className="text-text-muted">(수정됨)</span>
            ) : null}
          </div>
        </header>

        {post.imageUrl ? (
          <div className="mb-6 relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
              priority
            />
          </div>
        ) : null}

        <section className="text-body-md leading-relaxed text-text-primary">
          <MarkdownRenderer content={post.content} />
        </section>
      </article>

      <PostActions post={post} />
    </section>
  )
}
