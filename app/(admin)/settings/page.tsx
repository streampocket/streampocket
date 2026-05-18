import type { Metadata } from 'next'
import { SystemInfo } from './_components/SystemInfo'
import { RevenueSettings } from './_components/RevenueSettings'
import { SystemSettings } from './_components/SystemSettings'
import { ChatbotMenuSettings } from './_components/ChatbotMenuSettings'

export const metadata: Metadata = {
  title: '설정',
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SystemSettings />
      <ChatbotMenuSettings />
      <RevenueSettings />
      <SystemInfo />
    </div>
  )
}
