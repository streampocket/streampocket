import Link from 'next/link'
import { BRAND_NAME, LOGIN_PATH } from '@/constants/app'
import type { LandingNavItem } from '@/app/(landing)/_types'

type PublicHeaderProps = {
  navItems: LandingNavItem[]
}

export function PublicHeader({ navItems }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
            SP
          </span>
          <span className="text-base font-bold text-text-primary sm:text-lg">{BRAND_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={LOGIN_PATH}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  )
}
