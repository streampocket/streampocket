import type { Metadata } from 'next'
import { DramaClient } from './_components/DramaClient'

export const metadata: Metadata = {
  title: '드라마 계정 관리',
}

export default function DramaPage() {
  return <DramaClient />
}
