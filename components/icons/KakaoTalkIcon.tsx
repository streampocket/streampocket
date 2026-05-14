type KakaoTalkIconProps = {
  className?: string
}

export function KakaoTalkIcon({ className }: KakaoTalkIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#3C1E1E"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 3C6.477 3 2 6.582 2 11c0 2.846 1.866 5.34 4.683 6.756l-1.18 4.31a.4.4 0 0 0 .605.439l5.082-3.367c.27.018.54.028.81.028 5.523 0 10-3.582 10-8.166C22 6.582 17.523 3 12 3Z" />
    </svg>
  )
}
