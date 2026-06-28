import type { Metadata } from 'next'
import { OtpToolClient } from './_components/OtpToolClient'

export const metadata: Metadata = { title: 'OTP 발급' }

export default function OtpToolPage() {
  return <OtpToolClient />
}
