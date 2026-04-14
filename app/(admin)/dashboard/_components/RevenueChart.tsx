'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type { TooltipContentProps } from 'recharts'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useRevenueChart } from '../_hooks/useRevenueChart'

type Days = 7 | 30 | 90

const DAYS_OPTIONS: Array<{ value: Days; label: string }> = [
  { value: 7, label: '7일' },
  { value: 30, label: '30일' },
  { value: 90, label: '90일' },
]

function formatXAxis(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${Number(month)}/${Number(day)}`
}

function formatYAxis(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

function CustomTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 text-caption-md shadow-sm">
      <p className="mb-1 font-medium text-text-primary">{String(label)}</p>
      {payload.map((entry) => (
        <p key={String(entry.name)} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value ?? 0).toLocaleString('ko-KR')}원
        </p>
      ))}
    </div>
  )
}

export function RevenueChart() {
  const [days, setDays] = useState<Days>(30)
  const { data, isLoading } = useRevenueChart(days)

  return (
    <Card>
      <CardHeader>
        <h2 className="text-heading-md text-text-primary">매출 추이</h2>
        <div className="flex gap-1">
          {DAYS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-caption-md font-medium transition-colors ${
                days === opt.value
                  ? 'bg-brand text-white'
                  : 'text-text-muted hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-text-muted">
            로딩 중...
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-text-muted">
            데이터가 없습니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
                width={50}
              />
              <Tooltip content={CustomTooltip} />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="totalRevenue"
                name="총판매금"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="netProfit"
                name="순수익"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorProfit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  )
}
