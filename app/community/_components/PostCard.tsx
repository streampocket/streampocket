import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { CommunityPost } from '@/types/domain'

type Props = {
  post: CommunityPost
}

export function PostCard({ post }: Props) {
  const isNotice = post.category === 'notice'
  return (
    <Link
      href={`/community/${post.id}`}
      className="flex gap-4 rounded-xl border border-border bg-white p-4 transition hover:border-brand hover:shadow-sm"
    >
      {post.imageUrl ? (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-32">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 112px, 128px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
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
          <h3 className="line-clamp-2 text-body-md font-semibold text-text-primary">
            {post.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-caption-sm text-text-muted">
          <span>{post.authorName}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
      </div>
    </Link>
  )
}
