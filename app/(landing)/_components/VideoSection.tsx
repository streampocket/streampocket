import Image from 'next/image'
import { Card, CardBody } from '@/components/ui/Card'
import type { LandingVideo } from '@/app/(landing)/_types'

type VideoSectionProps = {
  videos: LandingVideo[]
  sectionId: string
}

export function VideoSection({ videos, sectionId }: VideoSectionProps) {
  if (videos.length === 0) return null

  return (
    <section id={sectionId} className="scroll-mt-24 bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">인기 유튜브 영상</h2>
          </div>
          <p className="text-sm font-bold text-brand">상품 전체 대신 콘텐츠로 먼저 탐색</p>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {videos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="flex h-full flex-col rounded-2xl shadow-none transition-shadow hover:shadow-md">
                <div className="relative mx-4 mt-4 aspect-video overflow-hidden rounded-[14px]">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <CardBody className="flex flex-1 flex-col p-4">
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-text-primary">
                    {video.title}
                  </p>
                  <p className="mt-2 text-xs font-medium text-text-secondary">
                    {video.channelName}
                  </p>
                </CardBody>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
