import Link from 'next/link'
import { BRAND_NAME } from '@/constants/app'

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 text-sm sm:flex-row sm:justify-between sm:px-8 lg:px-10">
        <div className="flex flex-col gap-1.5 text-text-secondary">
          <p className="font-bold text-text-primary">{BRAND_NAME}</p>
        </div>

        <nav className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/terms"
            className="font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            개인정보 처리방침
          </Link>
        </nav>
      </div>
    </footer>
  )
}
