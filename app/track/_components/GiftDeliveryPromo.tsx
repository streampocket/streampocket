/**
 * 2단계(게임선물 전송중) 하단 안내·단골 혜택 블록.
 * 국가 변경 완료를 알리고 다음 구매부터의 간편함을 안내한다.
 */
export function GiftDeliveryPromo() {
  return (
    <div className="mt-4 space-y-3 rounded-lg border border-brand-light bg-brand-light/40 p-4">
      <p className="text-center text-body-md font-bold text-brand md:text-sm">
        구매자님, 스팀 계정의 국가 변경이 완료되었습니다! ✨
      </p>

      <div className="rounded-lg bg-white/70 p-3">
        <p className="text-center text-body-md font-semibold text-text-primary md:text-sm">
          📢 남은 과정 : [ 게임 코드 전송 ]
        </p>
        <hr className="my-2 border-brand-light" />
        <p className="text-caption-md text-text-secondary md:text-sm">
          • 남은 시간 확인: 실시간 조회사이트에서 진행 상황을 확인 가능!
        </p>
      </div>

      <p className="text-body-md font-semibold text-text-primary md:text-sm">
        🎁 [단골 혜택]
      </p>
      <p className="text-caption-md text-text-secondary md:text-sm">
        스팀 게임, 이제 계정 전달 없이 간편하게!
      </p>

      <ul className="space-y-1.5 text-caption-md text-text-secondary md:text-sm">
        <li>🎮 모든 게임/DLC 100% 가능: 인디게임, 해외 코드, 번들까지 전부!</li>
        <li>🔒 개인정보 보호: 이미 국가 변경 완료, 다음부턴 계정 정보 필요 없음!</li>
        <li>⚡ 카톡 1초 해결: 게임 이름만 툭 던져주시면 발송!</li>
        <li className="font-semibold text-brand">🔥 카톡 문의 시 4~5% 즉시 할인!</li>
      </ul>

      <p className="text-caption-md text-text-secondary md:text-sm">
        이제 헤매지 마시고 저희 쪽에서 가장 편하게 스팀 게임을 즐겨보세요! 🚀
      </p>
    </div>
  )
}
