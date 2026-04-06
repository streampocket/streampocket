'use client'

import { useState } from 'react'
import { PartnerStatusTabs } from './_components/PartnerStatusTabs'
import { PartnerTable } from './_components/PartnerTable'
import { PartnerDetailModal } from './_components/PartnerDetailModal'
import { useAdminPartners } from './_hooks/useAdminPartners'
import { useApprovePartner } from './_hooks/useApprovePartner'
import { useRejectPartner } from './_hooks/useRejectPartner'
import type { PartnerTabStatus } from './_types'

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState<PartnerTabStatus>('all')
  const [detailPartnerId, setDetailPartnerId] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const queryStatus = activeTab === 'all' ? undefined : activeTab
  const { data: partners = [], isLoading } = useAdminPartners(
    queryStatus ? { status: queryStatus } : undefined,
  )

  const approveMutation = useApprovePartner()
  const rejectMutation = useRejectPartner()

  const handleApprove = (id: string) => {
    setApprovingId(id)
    approveMutation.mutate(id, {
      onSettled: () => setApprovingId(null),
    })
  }

  const handleReject = (id: string) => {
    setRejectingId(id)
    rejectMutation.mutate(
      { id },
      {
        onSettled: () => setRejectingId(null),
      },
    )
  }

  return (
    <div className="space-y-4">
      <PartnerStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-body-md text-text-muted">로딩 중...</p>
        </div>
      ) : (
        <PartnerTable
          partners={partners}
          activeTab={activeTab}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetail={setDetailPartnerId}
          approvingId={approvingId}
          rejectingId={rejectingId}
        />
      )}

      <PartnerDetailModal
        partnerId={detailPartnerId}
        onClose={() => setDetailPartnerId(null)}
      />
    </div>
  )
}
