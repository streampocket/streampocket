import type { Metadata } from 'next'
import { EmailTemplateForm } from './_components/EmailTemplateForm'
import { SystemInfo } from './_components/SystemInfo'

export const metadata: Metadata = {
  title: '설정',
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <EmailTemplateForm />
      <SystemInfo />
    </div>
  )
}
