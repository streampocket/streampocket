import type { LandingTrustItem } from '@/app/(landing)/_types'

type TrustSectionProps = {
  items: LandingTrustItem[]
}

export function TrustSection({ items }: TrustSectionProps) {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-5 py-6 sm:px-8 lg:grid-cols-3 lg:px-10">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white/5 p-5">
            <p className="text-base font-bold">{item.title}</p>
            <p className="mt-2 text-sm font-medium text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
