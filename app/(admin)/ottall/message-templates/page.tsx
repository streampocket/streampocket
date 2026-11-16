import type { Metadata } from 'next'
import { MessageTemplatesClient } from './_components/MessageTemplatesClient'

export const metadata: Metadata = {
  title: '안내 양식',
}

export default function MessageTemplatesPage() {
  return <MessageTemplatesClient />
}
