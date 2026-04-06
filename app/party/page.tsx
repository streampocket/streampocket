import type { Metadata } from "next";
import { USER_BRAND_NAME } from "@/constants/app";
import { OwnProductList } from "./_components/OwnProductList";

export const metadata: Metadata = {
  title: `파티 모집 | ${USER_BRAND_NAME}`,
  description: "OTT 파티 모집 상품 목록을 확인하세요.",
};

// 전체 상품
export default function ProductsPage() {
  return (
    <section className="py-4">
      <OwnProductList />
    </section>
  );
}
