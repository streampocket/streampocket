'use client'

import { Card, CardHeader, CardBody } from '@/components/ui/Card'

export function RevenueSettings() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">매출 설정</h2>
      </CardHeader>
      <CardBody>
        <p className="text-caption-sm text-text-muted">
          네이버 수수료는 6.63%로 고정 적용되어 정산금·순이익에 반영됩니다.
        </p>
      </CardBody>
    </Card>
  )
}
