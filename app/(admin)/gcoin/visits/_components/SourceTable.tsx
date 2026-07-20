'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { sourceLabel } from '../_types'
import type { OtherHost, SourceCount } from '../_types'

type SourceTableProps = {
  sources: SourceCount[]
  otherHosts: OtherHost[]
  totalVisits: number
}

export function SourceTable({ sources, otherHosts, totalVisits }: SourceTableProps) {
  const [isOtherOpen, setIsOtherOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <h3 className="text-heading-sm text-text-primary">유입 경로</h3>
      </CardHeader>
      <CardBody className="p-0">
        {sources.length === 0 ? (
          <p className="py-8 text-center text-caption-md text-text-muted">데이터가 없습니다</p>
        ) : (
          <ul>
            {sources.map((s) => {
              const ratio = totalVisits > 0 ? (s.count / totalVisits) * 100 : 0
              const isOther = s.source === 'other'
              return (
                <li key={s.source} className="border-b border-border last:border-0">
                  <div
                    className={`flex items-center gap-3 px-5 py-3 ${
                      isOther && otherHosts.length > 0 ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={
                      isOther && otherHosts.length > 0
                        ? () => setIsOtherOpen((prev) => !prev)
                        : undefined
                    }
                  >
                    <span className="w-28 shrink-0 text-body-md text-text-primary">
                      {sourceLabel(s.source)}
                      {isOther && otherHosts.length > 0 && (
                        <span className="ml-1 text-caption-sm text-text-muted">
                          {isOtherOpen ? '▲' : '▼'}
                        </span>
                      )}
                    </span>
                    <span className="w-16 shrink-0 text-right font-mono text-caption-md text-text-primary">
                      {s.count.toLocaleString()}
                    </span>
                    <span className="w-14 shrink-0 text-right text-caption-md text-text-secondary">
                      {ratio.toFixed(1)}%
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                  {isOther && isOtherOpen && (
                    <ul className="bg-gray-50 px-5 py-2">
                      {otherHosts.map((h) => (
                        <li
                          key={h.host}
                          className="flex items-center justify-between py-1 text-caption-md"
                        >
                          <span className="truncate font-mono text-text-secondary">{h.host}</span>
                          <span className="ml-3 shrink-0 font-mono text-text-primary">
                            {h.count.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
