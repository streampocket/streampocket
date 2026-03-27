'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BadgeVariant } from '@/components/ui/Badge'
import { ExportButton } from './ExportButton'
import { AccountDetailModal } from './AccountDetailModal'
import { useAccounts } from '../_hooks/useAccounts'
import type { AccountStatus, SteamAccount } from '@/types/domain'

const STATUS_MAP: Record<AccountStatus, { label: string; variant: BadgeVariant }> = {
  available: { label: '사용 가능', variant: 'green' },
  reserved: { label: '선점됨', variant: 'yellow' },
  sent: { label: '발송 완료', variant: 'blue' },
  disabled: { label: '비활성화', variant: 'gray' },
}

export function CodesTable() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId') || undefined
  const status = (searchParams.get('status') as AccountStatus) || undefined

  const { data, isLoading } = useAccounts({ productId, status })
  const [selectedAccount, setSelectedAccount] = useState<SteamAccount | null>(null)

  return (
    <>
      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-caption-md text-text-secondary">
            총 <strong className="text-text-primary">{data?.total ?? 0}</strong>개
          </p>
          <ExportButton productId={productId} status={status} />
        </div>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상품명</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">아이디</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">비밀번호</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary">상태</th>
                  <th className="text-label-md px-5 py-3 text-left text-text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      로딩 중...
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-caption-md px-5 py-10 text-center text-text-muted">
                      계정이 없습니다
                    </td>
                  </tr>
                ) : (
                  data?.data.map((account) => {
                    const st = STATUS_MAP[account.status]
                    return (
                      <tr
                        key={account.id}
                        className="border-b border-border last:border-0 hover:bg-gray-50"
                      >
                        <td className="text-caption-md px-5 py-3 text-text-secondary">
                          {account.productName}
                        </td>
                        <td className="font-mono text-caption-md px-5 py-3 text-text-primary">
                          {account.username}
                        </td>
                        <td className="font-mono text-caption-md px-5 py-3 text-text-secondary">
                          {account.password}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setSelectedAccount(account)}
                          >
                            상세
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <AccountDetailModal
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </>
  )
}
