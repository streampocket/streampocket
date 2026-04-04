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
            <span className="block mt-2 text-sm text-red-700">
              AA 상품은 스팀게임을 선물로 보내드리는 상품입니다. 선물해주는
              계정의 국가가 중국이기 때문에, 상점 국가를 중국으로 변경해야 하니,
              아래 가이드를 참고해주세요.
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
          <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            📥 카카오톡 등록 접수 양식
          </h4>
          <div className="relative">
            <div className="absolute right-3 top-3">
              <CopyFormButton
                text={`1. 구매하신 게임 :\n\n2. 구매 날짜 :\n\n3. 구매자 성함 :\n\n4. 국가 변경 및 등록 이후 환불 불가 동의 :\n\n5. 캡쳐 이미지 :`}
              />
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 pt-10 text-sm font-mono whitespace-pre overflow-x-auto leading-relaxed">
              {`1. 구매하신 게임 :

2. 구매 날짜 :

3. 구매자 성함 :

4. 국가 변경 및 등록 이후 환불 불가 동의 :

5. 캡쳐 이미지 :`}
            </pre>
          </div>
        </section>

        {/* 4. 중국 계정 사용자 아닌경우 */}
        <section className="space-y-8">
          <h2 className="text-lg font-semibold text-gray-800">
            중국 계정 사용자 아닌경우
          </h2>

          {/* (1) OTP 사용자 */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-5 space-y-4">
            <h3 className="text-lg font-semibold text-green-800">
              (1) 모바일 앱 인증기(OTP)를 사용하신다면?
            </h3>
            <p className="text-sm text-gray-700">
              스팀가드 해제없이 아래 링크 클릭 후 사진에 나온대로 접속하신다음
              양식을 카카오톡으로 접수!
            </p>
            <Link
              href="https://store.steampowered.com/twofactor/manage_action"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-brand underline text-sm"
            >
              👉 여기 클릭 (Steam Guard 관리)
            </Link>
            <div className="space-y-3">
              <Image
                src="/images/guide/스팀가드관리.png"
                alt="Steam Guard 관리 페이지에서 백업 코드 받기 클릭"
                width={600}
                height={400}
                className="rounded-lg w-full md:max-w-md"
              />
              <Image
                src="/images/guide/예비코드입력.png"
                alt="Steam Guard 예비 코드 - SMS 인증 코드 입력"
                width={600}
                height={400}
                className="rounded-lg w-full md:max-w-md"
              />
              <Image
                src="/images/guide/예비코드결과.png"
                alt="Steam Guard 예비 코드 - 생성된 백업 코드 확인"
                width={600}
                height={400}
                className="rounded-lg w-full md:max-w-md"
              />
            </div>
            <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              📥 카카오톡 등록 접수 양식
            </h4>
            <div className="relative">
              <div className="absolute right-3 top-3">
                <CopyFormButton
                  text={`1. 스팀 등록 ID :\n\n2. 스팀 등록 PW :\n\n3. 구매하신 게임 :\n\n4. 구매 날짜 :\n\n5. 구매자 성함 :\n\n6. 1회용 Steam Guard 코드 3개(위 마지막 사진의 빨간색 네모박스 코드) :\n\n7. 국가 변경 정책(3개월 제한) 및 등록 이후 환불 불가 동의 :`}
                />
              </div>
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 pt-10 text-sm font-mono whitespace-pre overflow-x-auto leading-relaxed">
                {`1. 스팀 등록 ID :

2. 스팀 등록 PW :

3. 구매하신 게임 :

4. 구매 날짜 :

5. 구매자 성함 :

6. 1회용 Steam Guard 코드 3개 (위 마지막 사진의 빨간색 네모박스 코드) :

7. 국가 변경 및 등록 이후 환불 불가 동의:`}
              </pre>
            </div>
          </div>

          {/* (2) 이메일 인증 사용자 */}
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-5 space-y-3">
            <h3 className="text-lg font-semibold text-purple-800">
              (2) 이메일 인증 사용자라면?
            </h3>
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
            <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2 mt-4">
              📥 카카오톡 등록 접수 양식
            </h4>
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

7. 국가 변경 및 등록 이후 환불 불가 동의 :`}
              </pre>
            </div>
          </div>
        </section>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
          게임 등록이 완전히 완료될 때까지 스팀가드 해제 상태를 반드시 유지해
          주세요. 중간에 다시 켜질 경우 등록이 중단됩니다.
        </div>

        {/* 5. 등록 진행 안내 */}
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
