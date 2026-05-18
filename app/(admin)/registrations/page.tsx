'use client'

import { Suspense } from 'react'
import { RegistrationsFilterBar } from './_components/RegistrationsFilterBar'
import { RegistrationsTable } from './_components/RegistrationsTable'

export default function RegistrationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-md text-text-primary">스팀 등록 접수</h2>
      </div>

      <Suspense>
        <RegistrationsFilterBar />
      </Suspense>
      <Suspense>
        <RegistrationsTable />
      </Suspense>
    </div>
  )
}
