'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCommissionRate, useUpdateCommissionRate } from '@/hooks/useCommissionRate'
import { useAlimtalkCost, useUpdateAlimtalkCost } from '@/hooks/useAlimtalkCost'

export function RevenueSettings() {
  const { data: commissionRate, isLoading: loadingRate } = useCommissionRate()
  const { data: alimtalkCost, isLoading: loadingCost } = useAlimtalkCost()
  const updateRate = useUpdateCommissionRate()
  const updateCost = useUpdateAlimtalkCost()

  const [editingRate, setEditingRate] = useState(false)
  const [rateInput, setRateInput] = useState('')
  const [editingCost, setEditingCost] = useState(false)
  const [costInput, setCostInput] = useState('')

  const handleEditRate = useCallback(() => {
    setRateInput(String(commissionRate ?? 0))
    setEditingRate(true)
  }, [commissionRate])

  const handleSaveRate = useCallback(() => {
    const value = parseFloat(rateInput)
    if (isNaN(value) || value < 0 || value > 100) return
    updateRate.mutate(value, {
      onSuccess: () => setEditingRate(false),
    })
  }, [rateInput, updateRate])

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
          {/* 수수료율 */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-body-md font-medium text-text-primary">네이버 수수료율</p>
              <p className="text-caption-md text-text-muted">
                구매자 결제 금액에서 네이버가 차감하는 비율
              </p>
            </div>
            {editingRate ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-24 rounded-lg border border-border bg-card-bg px-3 py-1.5 text-body-sm text-text-primary focus:border-brand focus:outline-none"
                />
                <span className="text-body-sm text-text-muted">%</span>
                <Button size="sm" onClick={handleSaveRate} loading={updateRate.isPending}>
                  저장
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditingRate(false)}>
                  취소
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-body-md font-semibold text-text-primary">
                  {loadingRate ? '-' : `${commissionRate}%`}
                </span>
                <Button variant="secondary" size="sm" onClick={handleEditRate}>
                  수정
                </Button>
              </div>
            )}
          </div>

          {/* 알림톡 단가 */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-body-md font-medium text-text-primary">알림톡 단가</p>
              <p className="text-caption-md text-text-muted">
                건당 알림톡 발송 비용
              </p>
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
        </div>
      </CardBody>
    </Card>
  )
}
