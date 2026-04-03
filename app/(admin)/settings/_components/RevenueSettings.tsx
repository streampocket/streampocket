'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAlimtalkCost, useUpdateAlimtalkCost } from '@/hooks/useAlimtalkCost'

export function RevenueSettings() {
  const { data: alimtalkCost, isLoading: loadingCost } = useAlimtalkCost()
  const updateCost = useUpdateAlimtalkCost()

  const [editingCost, setEditingCost] = useState(false)
  const [costInput, setCostInput] = useState('')

  const handleEditCost = useCallback(() => {
    setCostInput(String(alimtalkCost ?? 6.5))
    setEditingCost(true)
  }, [alimtalkCost])

  const handleSaveCost = useCallback(() => {
    const value = parseFloat(costInput)
    if (isNaN(value) || value < 0) return
    updateCost.mutate(value, {
      onSuccess: () => setEditingCost(false),
    })
  }, [costInput, updateCost])

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">매출 설정</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-body-md font-medium text-text-primary">알림톡 단가</p>
              <p className="text-caption-md text-text-muted">건당 알림톡 발송 비용</p>
            </div>
            {editingCost ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  className="w-24 rounded-lg border border-border bg-card-bg px-3 py-1.5 text-body-sm text-text-primary focus:border-brand focus:outline-none"
                />
                <span className="text-body-sm text-text-muted">원</span>
                <Button size="sm" onClick={handleSaveCost} loading={updateCost.isPending}>
                  저장
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditingCost(false)}>
                  취소
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-body-md font-semibold text-text-primary">
                  {loadingCost ? '-' : `${alimtalkCost}원`}
                </span>
                <Button variant="secondary" size="sm" onClick={handleEditCost}>
                  수정
                </Button>
              </div>
            )}
          </div>

          <p className="text-caption-sm text-text-muted">
            네이버 수수료는 구매확정 시 네이버가 자동 계산하여 정산금에 반영됩니다.
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
