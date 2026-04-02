import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyFormButton } from "./_components/CopyFormButton";

export const metadata: Metadata = {
  title: "스팀 등록 안내 가이드 | 스트림포켓",
  description: "스팀 게임 코드 등록 전 필수 확인 안내입니다.",
};

export default function GuidePage() {
  return (
    <>
      <header className="border-b bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-lg font-bold text-brand">스트림포켓</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-10">
        {/* 1. 히어로 */}
        <section>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            🎮 [필독] 스팀 등록 안내 가이드
          </h1>
          <p className="text-gray-600 leading-relaxed">
            주문해주셔서 감사합니다! 본 상품은 스팀 상점 국가가 변경되는
            상품입니다. 등록 전 아래 내용을 반드시 확인해 주세요.
          </p>
        </section>

        {/* 2. 국가 변경 제한 정책 안내 */}
        <section className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-800">
            🚫 스팀(Steam) 정책상 국가 변경은 3개월에 한 번으로 제한되어
            있습니다. 최근 3개월 이내에 국가를 변경한 이력이 있다면 다른 계정
            사용을 부탁드립니다.
            <span className="block mt-1 text-xs text-red-600">
              (상점 국가: 중국 예외)
            </span>
          </p>
        </section>

        {/* 3. 중국 계정 경고 */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-yellow-800">
            ⚠️ 중요: 중국 계정 사용자의 경우
          </h2>
          <p className="text-sm text-yellow-700">
            현재 본인의 스팀 계정 상점 국가가 이미 [중국]으로 설정되어 있다면,
            스팀가드 해제나 계정 정보 전달이 필요 없습니다.
          </p>
          <div>
            <p className="font-medium text-gray-800 mb-3">
              상점 국가 확인 방법
            </p>
            <ol className="space-y-2">
              {[
                "스팀 로그인 후 우측 상단 [사용자 명] 클릭",
                "[계정 정보] 메뉴 접속",
                "'상점 및 구매 내역' 항목에서 국가: 중국 여부 확인",
                "해당 화면을 캡쳐하여 카카오톡으로 보내주세요",
              ].map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <Image
            src="/images/guide/국가확인.png"
            alt="스팀 상점 국가 확인 화면"
            width={600}
            height={400}
            className="rounded-lg w-full md:max-w-md"
          />
        </section>

        {/* 4. 스팀가드 해제 방법 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🔐 스팀가드 해제 방법
          </h2>
          <p className="text-sm text-gray-600">
            중국 계정 외 사용자라면 아래 순서대로 진행해 주세요. 원활한 게임
            등록을 위해 반드시 스팀가드를 해제한 상태로 대기해 주셔야 합니다.
          </p>
          <div className="bg-gray-50 border rounded-xl p-5 space-y-2">
            <p className="font-medium text-gray-800">
              모바일 인증기(OTP) 사용자
            </p>
            <p className="text-sm text-gray-600">
              스마트폰 스팀(Steam) 앱에 접속하여 [인증기 삭제]를 진행해 주세요.
              인증기를 삭제하면 자동으로 이메일 인증 방식으로 전환됩니다.
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-gray-800">이메일 인증 사용자</p>
            <ol className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  스팀가드 설정 페이지 접속{" "}
                  <Link
                    href="https://store.steampowered.com/twofactor/manage_action"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline"
                  >
                    👉 여기 클릭 (Steam Guard 관리)
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                [Steam Guard 끄기] 버튼을 클릭합니다.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                이메일 인증 확인: 이메일함에서 해제 승인 메일을 꼭
                확인(Confirm)해주셔야 완전히 해제됩니다.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                  4
                </span>
                가족 모드 비활성화: 설정되어 있다면 반드시 꺼주세요.
              </li>
            </ol>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
            게임 등록이 완전히 완료될 때까지 스팀가드 해제 상태를 반드시 유지해
            주세요. 중간에 다시 켜질 경우 등록이 중단됩니다.
          </div>
        </section>

        {/* 5. 카카오톡 등록 접수 양식 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📥 카카오톡 등록 접수 양식
          </h2>
          <p className="text-sm text-gray-600">
            스팀가드 해제 완료 후 아래 양식을 그대로 보내주세요
          </p>
          <div className="relative">
            <div className="absolute right-3 top-3">
              <CopyFormButton />
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 pt-10 text-sm font-mono whitespace-pre overflow-x-auto leading-relaxed">
              {`1. 스팀 등록 ID :

2. 스팀 등록 PW :

3. 스팀가드 해제 여부 :

4. 구매하신 게임 :

5. 구매 날짜 :

6. 구매자 성함 :

7. 국가 변경 정책(3개월 제한) 및 등록 이후 환불 불가 동의 :

8. 캡쳐 이미지(중국 계정만) :`}
            </pre>
          </div>
        </section>

        {/* 6. 등록 진행 안내 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            ✅ 등록 진행 안내
          </h2>
          <p className="text-sm text-gray-500">
            처리 시간, 환불 기준, 보안 권장 사항까지 한 번에 확인
          </p>
          <ul className="space-y-3">
            {[
              "등록 접수 후 완료까지 최소 30분 이상 소요될 수 있습니다. 장시간 소요될 수 있다는 점 알려드립니다.",
              "새벽 시간 접수 건은 오전 10시 이후 순차적으로 처리됩니다.",
              "등록 절차 진행 도중 혹은 이후에는 환불이 불가합니다. 환불은 절차 이전에 문의바랍니다.",
              "등록 대기 중 게임 플레이는 가능하지만, 비밀번호 변경 및 스팀가드 설정은 절대 금지합니다. 설정 변경 시 등록이 지연됩니다.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-brand mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium mb-1">등록 완료 후 보안 권장</p>
            등록 완료 연락을 받으시면 즉시 비밀번호 변경 및 스팀가드 재활성화를
            권장합니다. 이후 발생하는 계정 보안 문제에 대해서는 판매자가
            책임지지 않습니다.
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 px-4 py-8 mt-10">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
            <p className="font-medium mb-1">
              🎁 리뷰 작성 후 문의주시면 게임코드를 무료로 보내드립니다
            </p>
            리뷰작성 후 네이버톡톡이나 카카오톡으로 문의주시면 게임코드를 무료로
            보내드립니다.
          </div>
          <p className="text-xs text-gray-400 text-center">
            스트림포켓 · 등록 전 필수 확인 안내
          </p>
        </div>
      </footer>
    </>
  );
}
