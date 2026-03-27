import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { API_BASE_URL } from '@/constants/app'

const INFO_ROWS = [
  { label: '프론트엔드', value: 'Next.js 14 (App Router)' },
  { label: '백엔드', value: 'Express + TypeScript' },
  { label: 'DB', value: 'PostgreSQL (Prisma ORM)' },
  { label: '메시지 발송', value: '알리고 알림톡' },
  { label: '알림', value: 'Discord Webhook' },
  { label: 'API 엔드포인트', value: API_BASE_URL },
]

export function SystemInfo() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-sm text-text-primary">시스템 정보</h2>
        <span className="text-caption-sm text-text-muted">읽기 전용</span>
      </CardHeader>
      <CardBody className="p-0">
        <dl>
          {INFO_ROWS.map((row, index) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-3 ${index < INFO_ROWS.length - 1 ? 'border-b border-border' : ''}`}
            >
              <dt className="text-caption-md text-text-secondary">{row.label}</dt>
              <dd className="font-mono text-caption-md text-text-primary">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  )
}
