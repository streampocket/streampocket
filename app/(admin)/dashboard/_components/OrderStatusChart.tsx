import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'

type StatusRow = {
  label: string
  variant: BadgeVariant
  count: number
  percent: number
}

const STATUS_ROWS: StatusRow[] = [
  { label: '처리 완료', variant: 'green', count: 0, percent: 0 },
  { label: '처리 대기', variant: 'yellow', count: 0, percent: 0 },
  { label: '수동 처리', variant: 'red', count: 0, percent: 0 },
  { label: '실패', variant: 'gray', count: 0, percent: 0 },
]

export function OrderStatusChart() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-sm text-text-primary">주문 상태 분포</h2>
        <span className="text-caption-md text-text-muted">이번 달</span>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {STATUS_ROWS.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <Badge variant={row.variant} className="w-20 justify-center">
                {row.label}
              </Badge>
              <div className="flex-1 overflow-hidden rounded-full bg-gray-100" style={{ height: 8 }}>
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="text-caption-md w-6 text-right text-text-secondary">{row.count}</span>
            </div>
          ))}
        </div>
        <p className="text-caption-sm mt-4 text-center text-text-muted">
          실시간 데이터는 백엔드 연동 후 표시됩니다
        </p>
      </CardBody>
    </Card>
  )
}
