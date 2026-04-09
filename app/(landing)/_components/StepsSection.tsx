import { Card, CardBody } from '@/components/ui/Card'
import type { LandingStep } from '@/app/(landing)/_types'

type StepsSectionProps = {
  steps: LandingStep[]
  sectionId: string
}

export function StepsSection({ steps, sectionId }: StepsSectionProps) {
  return (
    <section id={sectionId} className="scroll-mt-24 bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-text-primary">이용 방법</h2>
          <p className="mt-2 text-sm font-medium text-text-secondary">
            간단한 4단계로 OTT 파티에 참여할 수 있습니다
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.id} className="rounded-2xl border-transparent bg-gray-50 shadow-none">
              <CardBody className="space-y-2 p-5">
                <p className="text-lg font-bold text-text-primary">{step.title}</p>
                <p className="text-sm font-medium text-text-secondary">{step.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
