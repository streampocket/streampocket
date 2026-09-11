import type { Metadata } from "next";
import { USER_BRAND_NAME, USER_OG_IMAGE, USER_SITE_URL } from "@/constants/app";
import { OTT_ENGLISH_NAME_LIST } from "@/constants/ottNames";
import { OwnProductList } from "./_components/OwnProductList";
import {
  fetchOwnCategoriesForListServer,
  fetchOwnProductsServer,
} from "@/lib/ownProductServerApi";

const PAGE_TITLE = "OTT·숏폼 드라마 파티 모집";
const PAGE_DESCRIPTION =
  "드라마박스(Dramabox), 릴숏(Reelshort), 숏맥스(Shortmax) 등 숏폼 드라마 앱과 OTT를 파티로 저렴하게 이용하세요.";

// JSON-LD에 담을 파티 수 상한 — 모집중이 수십 개까지 늘 수 있어 마크업이 과도해지지 않게 자른다
const ITEM_LIST_LIMIT = 30;

/** JSON-LD 삽입용 직렬화 — '<'를 이스케이프해 script 태그가 조기 종료되지 않게 한다 */
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

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
//
// 목록을 서버에서 미리 받아 초기 HTML에 파티 링크를 심는다. 이전에는 클라이언트에서만
// 받아와 크롤러가 받는 HTML에 링크가 하나도 없었고, JS 실행이 약한 네이버 크롤러(Yeti)는
// 목록을 빈 화면으로 봤다. 필터 상호작용은 그대로 클라이언트가 담당한다.
export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    fetchOwnProductsServer({ status: "recruiting" }),
    fetchOwnCategoriesForListServer(),
  ]);

  // 목록 페이지임을 명시한다 — 서버에서 이미 받은 products를 쓰므로 추가 조회가 없다
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${USER_SITE_URL}/party`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, ITEM_LIST_LIMIT).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${USER_SITE_URL}/party/${product.id}`,
    })),
  };

  return (
    <section className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <OwnProductList initialProducts={products} initialCategories={categories} />
    </section>
  );
}
