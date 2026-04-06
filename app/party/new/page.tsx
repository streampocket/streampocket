import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { UserAuthGuard } from '@/components/auth/UserAuthGuard'
import { PartnerStatusGuard } from './_components/PartnerStatusGuard'
import { OwnProductForm } from './_components/OwnProductForm'

export const metadata: Metadata = {
  title: `상품 등록 | ${USER_BRAND_NAME}`,
  description: '새로운 파티 모집 상품을 등록합니다.',
}

export default function NewProductPage() {
  return (
    <UserAuthGuard>
      <section className="py-4">
        <PartnerStatusGuard>
          <OwnProductForm />
        </PartnerStatusGuard>
      </section>
    </UserAuthGuard>
  )
}
