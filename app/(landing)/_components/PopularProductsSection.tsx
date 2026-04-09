import Link from 'next/link'
import { OwnProductCard } from '@/app/party/_components/OwnProductCard'
import type { OwnProduct } from '@/types/domain'

type PopularProductsSectionProps = {
  products: OwnProduct[]
  sectionId: string
}

export function PopularProductsSection({
  products,
  sectionId,
}: PopularProductsSectionProps) {
  if (products.length === 0) return null

  return (
    <section id={sectionId} className="scroll-mt-24 bg-gray-50">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">지금 많이 보는 상품</h2>
          </div>
          <Link
            href="/party"
            className="text-sm font-bold text-brand transition-colors hover:text-brand-dark"
          >
            전체 상품 보기 →
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <OwnProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
