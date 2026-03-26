import type { Metadata } from 'next'
import { AlimtalkSettingsForm } from './_components/AlimtalkSettingsForm'

export const metadata: Metadata = {
  title: '알림톡',
}

export default function AlimtalkPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AlimtalkSettingsForm />
    </div>
  )
}
