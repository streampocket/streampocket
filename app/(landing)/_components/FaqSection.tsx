import { Card, CardBody } from '@/components/ui/Card'
import type { LandingFaq } from '@/app/(landing)/_types'

type FaqSectionProps = {
  faqs: LandingFaq[]
  sectionId: string
}

export function FaqSection({ faqs, sectionId }: FaqSectionProps) {
  return (
    <section id={sectionId} className="scroll-mt-24 bg-gray-50">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-text-primary">자주 묻는 질문</h2>
        </div>

        <div className="mt-6 grid gap-3">
          {faqs.map((faq) => (
            <Card key={faq.id} className="rounded-2xl shadow-none">
              <CardBody className="space-y-2 p-5">
                <p className="text-base font-bold text-text-primary">{faq.question}</p>
                <p className="text-sm font-medium text-text-secondary">{faq.answer}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
