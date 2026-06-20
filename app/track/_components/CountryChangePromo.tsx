/**
 * 1단계(국가변경 작업중) 하단 마케팅 안내 블록.
 * 스토어 차별점을 안내해 구매자 불안을 줄인다.
 */
export function CountryChangePromo() {
  return (
    <div className="mt-4 space-y-3 rounded-lg border border-brand-light bg-brand-light/40 p-4">
      <p className="text-center text-body-md font-bold text-brand md:text-sm">
        🌐 스팀 국가 변경 완료 ➡️ 🔑 해외 코드 등록 ➡️ 🎮 즉시 플레이!
      </p>
      <p className="text-center text-caption-md text-text-secondary md:text-sm">
        타 스토어처럼 숨기지 않습니다. 등록 절차를 투명하게 안내해 드립니다! 👍
      </p>

      <p className="text-body-md font-semibold text-text-primary md:text-sm">
        📌 &ldquo;스팀 국가 변경 후 사후 처리, 아직도 불안하신가요?&rdquo;
      </p>
      <p className="text-caption-md text-text-secondary md:text-sm">
        변경 이후까지 완벽하고 안전하게 케어해 드리는 곳은 오직 여기뿐입니다.
      </p>

      <ul className="space-y-1.5 text-caption-md md:text-sm">
        <li className="text-text-secondary">
          ❌ 타 스토어: 진열된 인기 게임 몇 개만 판매 (비인기 게임, DLC 구매 불가)
        </li>
        <li className="text-text-secondary">
          ❌ 타 스토어: 국가 변경만 해주고 끝? 추후에 원하는 게임 코드가 없어서 결국 직접 해외
          결제하느라 애먹는 경우가 허다합니다.
        </li>
        <li className="font-semibold text-brand">
          ⭕ 우리 스토어: 스토어에 없어도 스팀 내 모든 게임 100% 구매 가능!
        </li>
      </ul>

      <div className="space-y-1.5 text-caption-md text-text-secondary md:text-sm">
        <p>
          <span className="font-semibold text-text-primary">[스토어에 상품이 없어도 문의 주세요!]</span>{' '}
          스팀의 모든 게임, 숨은 명작, DLC, 패키지 등 모든 해외 코드를 상시 보유하고 있습니다.
        </p>
        <p>
          <span className="font-semibold text-text-primary">[결제 스트레스 ZERO]</span> 해외 결제
          수단이 없어서, 혹은 결제 오류 때문에 겪던 번거로움은 이제 잊으세요. 원하는 게임만
          고르시면 복잡한 과정 없이 쉽고 빠르게 코드로 구매하실 수 있습니다!
        </p>
      </div>
    </div>
  )
}
