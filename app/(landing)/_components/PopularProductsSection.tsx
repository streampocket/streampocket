import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import type { LandingProduct } from '@/app/(landing)/_types'

type PopularProductsSectionProps = {
  products: LandingProduct[]
  sectionId: string
}

export function PopularProductsSection({
  products,
  sectionId,
}: PopularProductsSectionProps) {
  return (
    <section id={sectionId} className="scroll-mt-24 bg-gray-50">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">지금 많이 보는 상품</h2>
          </div>
          <Link
            href={`#${sectionId}`}
            className="text-sm font-bold text-brand transition-colors hover:text-brand-dark"
          >
            전체 상품 보기 →
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="rounded-2xl border-border shadow-none">
              <CardBody className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <span className={`h-9 w-9 rounded-xl ${product.accentClassName}`} />
                  <p className="text-lg font-bold text-text-primary">{product.name}</p>
                </div>
                <div className="space-y-2">
                  <Badge variant={product.statusTone}>{product.statusLabel}</Badge>
                  <p className="text-sm font-medium text-text-secondary">{product.priceLabel}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
