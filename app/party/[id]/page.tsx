import type { Metadata } from 'next'
import { USER_BRAND_NAME } from '@/constants/app'
import { OwnProductDetail } from './_components/OwnProductDetail'

export const metadata: Metadata = {
  title: `상품 상세 | ${USER_BRAND_NAME}`,
  description: '파티 모집 상품의 상세 정보를 확인하세요.',
}

export default function ProductDetailPage() {
  return (
    <section className="py-4">
      <OwnProductDetail />
    </section>
  )
}
