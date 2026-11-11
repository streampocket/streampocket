import type { Metadata } from 'next'
import { StaffClient } from './_components/StaffClient'

export const metadata: Metadata = {
  title: '직원 관리',
}

export default function StaffPage() {
  return <StaffClient />
}
