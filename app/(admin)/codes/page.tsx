'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import { CodesFilterBar } from './_components/CodesFilterBar'
import { CodesTable } from './_components/CodesTable'
import { BulkUploadModal } from './_components/BulkUploadModal'

export default function CodesPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-md text-text-primary">계정 재고 관리</h2>
        <Button size="sm" onClick={() => setIsUploadOpen(true)}>
          + 일괄 등록
        </Button>
      </div>

      <Suspense>
        <CodesFilterBar />
      </Suspense>
      <Suspense>
        <CodesTable />
      </Suspense>

      {isUploadOpen && <BulkUploadModal onClose={() => setIsUploadOpen(false)} />}
    </div>
  )
}
