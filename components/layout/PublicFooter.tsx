import Link from 'next/link'
import { BRAND_NAME } from '@/constants/app'

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 text-sm sm:flex-row sm:justify-between sm:px-8 lg:px-10">
        <div className="flex flex-col gap-1.5 text-text-secondary">
          <p className="font-bold text-text-primary">{BRAND_NAME}</p>
          <p>대표: 송동건</p>
          <p>전화: +82 10.4823.7645</p>
          <p>
            메일:{' '}
            <a
              href="mailto:steampocket0@gmail.com"
              className="transition-colors hover:text-text-primary"
            >
              steampocket0@gmail.com
            </a>
          </p>
          <p>본사: 경기도 양주시 부흥로 1936, 다온프라자 405호-R100호</p>
          <p>사업자 번호: 279-25-02096</p>
          <p>개인정보관리책임자: 송동건 (steampocket0@gmail.com)</p>
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
          <Link
            href="/terms/partner"
            className="font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            파트너(판매자) 이용약관
          </Link>
        </nav>
      </div>
    </footer>
  )
}
