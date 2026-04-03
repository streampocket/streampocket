import { Card, CardBody } from '@/components/ui/Card'
import type { LandingVideo } from '@/app/(landing)/_types'

type VideoSectionProps = {
  videos: LandingVideo[]
  sectionId: string
}

export function VideoSection({ videos, sectionId }: VideoSectionProps) {
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
            <Card key={video.id} className="rounded-2xl shadow-none">
              <div className="mx-4 mt-4 h-[150px] rounded-[14px] bg-[#F3F4F6]" />
              <CardBody className="space-y-2 p-4">
                <p className="text-sm font-bold text-text-primary">{video.title}</p>
                <p className="text-xs font-medium text-text-secondary">{video.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
