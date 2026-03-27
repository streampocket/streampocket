import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function StockChart() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-sm text-text-primary">재고 현황</h2>
        <Badge variant="yellow">상품 관리에서 확인</Badge>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <span className="mb-3 text-4xl">📦</span>
          <p className="text-body-md text-text-secondary">상품별 재고 현황</p>
          <p className="text-caption-md mt-1 text-text-muted">
            재고 ≤ 2개 시 Discord 경고 알림이 발송됩니다
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
