'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import { CodesFilterBar } from './_components/CodesFilterBar'
import { CodesTable } from './_components/CodesTable'
import { BulkUploadModal } from './_components/BulkUploadModal'
import { SingleCreateModal } from './_components/SingleCreateModal'

export default function CodesPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isSingleOpen, setIsSingleOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-md text-text-primary">계정 재고 관리</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setIsSingleOpen(true)}>
            + 단건 등록
          </Button>
          <Button size="sm" onClick={() => setIsUploadOpen(true)}>
            + 일괄 등록
          </Button>
        </div>
      </div>

      <Suspense>
        <CodesFilterBar />
      </Suspense>
      <Suspense>
        <CodesTable />
      </Suspense>

      {isUploadOpen && <BulkUploadModal onClose={() => setIsUploadOpen(false)} />}
      {isSingleOpen && <SingleCreateModal onClose={() => setIsSingleOpen(false)} />}
    </div>
  )
}
