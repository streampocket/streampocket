import type { Metadata } from "next";
import { USER_BRAND_NAME, USER_OG_IMAGE, USER_SITE_URL } from "@/constants/app";
import { OTT_ENGLISH_NAME_LIST } from "@/constants/ottNames";
import { OwnProductList } from "./_components/OwnProductList";

const PAGE_TITLE = "OTT·숏폼 드라마 파티 모집";
const PAGE_DESCRIPTION =
  "드라마박스(Dramabox), 릴숏(Reelshort), 숏맥스(Shortmax) 등 숏폼 드라마 앱과 OTT를 파티로 저렴하게 이용하세요.";

// 레이아웃 title.template('%s | OTTALL')이 접미사를 자동 부착하므로 접미사 없이 반환
export const metadata: Metadata = {
  title: PAGE_TITLE,
  // utm 등 쿼리 변형 주소를 대표 주소 하나로 통합 (중복 색인 방지)
  alternates: { canonical: `${USER_SITE_URL}/party` },
  description: PAGE_DESCRIPTION,
  openGraph: {
    type: "website",
    title: `${PAGE_TITLE} | ${USER_BRAND_NAME}`,
    description: PAGE_DESCRIPTION,
    url: `${USER_SITE_URL}/party`,
    siteName: USER_BRAND_NAME,
    locale: "ko_KR",
    images: [USER_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | ${USER_BRAND_NAME}`,
    description: PAGE_DESCRIPTION,
    images: [USER_OG_IMAGE],
  },
  keywords: [
    "숏폼 드라마",
    "숏폼 드라마 앱",
    "OTT 파티",
    "OTT 공동구매",
    "드라마박스",
    "드라마웨이브",
    "비글루",
    "릴숏",
    "넷숏",
    "플릭릴스",
    "숏맥스",
    ...OTT_ENGLISH_NAME_LIST,
  ],
};

// 전체 파티
export default function ProductsPage() {
  return (
    <section className="py-4">
      <OwnProductList />
    </section>
  );
}
