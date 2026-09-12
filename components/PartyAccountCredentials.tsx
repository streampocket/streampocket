'use client'

import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { buildMemoLines } from '@/lib/dramaMemo'
import type {
  MemoLine,
  PartyAccountCredentials as Credentials,
} from '@/types/domain'

type PartyAccountCredentialsProps = {
  credentials: Credentials
  /** 아직 배정되지 않은 "예정" 계정인가 — 승인 전 미리보기에서 true */
  tentative?: boolean
  /** 시크릿 불일치를 고칠 수 있는 화면(주문 관리)에서만 넘긴다 */
  onSyncSecret?: () => void
  syncing?: boolean
}

/**
 * 배정된 드라마 계정의 아이디·비밀번호·OTP 시크릿 표시.
 *
 * 신청 관리 상세와 주문 관리 OTP 탭이 함께 쓴다.
 * 마스킹·복사 버튼을 두지 않는 건 드라마 계정 관리·스팀 계정 관리와 맞춘 것이다
 * (관리자 전용 화면이고, 복사 버튼은 운영 중 오히려 걸리적거려 제거된 이력이 있다).
 */
export function PartyAccountCredentials({
  credentials,
  tentative = false,
  onSyncSecret,
  syncing = false,
}: PartyAccountCredentialsProps) {
  const {
    source,
    memberId,
    email,
    password,
    otpSecret,
    platform,
    dueAt,
    secretMismatch,
    ambiguous,
    memo,
  } = credentials

  return (
    <div className="space-y-2 rounded-lg border border-border bg-gray-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-caption-md font-semibold text-text-primary">
          {tentative ? '배정 예정 계정' : '배정된 계정'}
        </span>
        {tentative ? (
          <Badge variant="yellow">아직 확정 아님</Badge>
        ) : (
          <Badge variant="green">{source === 'matched_by_secret' ? '시크릿으로 찾음' : '배정됨'}</Badge>
        )}
      </div>

      {tentative && (
        <p className="text-caption-sm text-text-muted">
          승인 시점에 다른 계정으로 바뀔 수 있습니다. 확정 값은 승인 후에 확인해 주세요.
        </p>
      )}

      {memo && email !== null && password !== null ? (
        <MemoBlock
          lines={buildMemoLines({ email, password, otpSecret, platform, dueAt, ...memo })}
          highlightMemberId={memberId}
        />
      ) : (
        // memo가 없으면(= 계정을 못 찾은 secret_only) 메모를 만들 수 없어 기존 라벨 표시로 떨어진다.
        // 배정 링크가 있어도 그 사이 계정이 지워졌다면 서버가 시크릿 역추적으로 넘겨
        // secret_only로 내려주므로, 여기서 따로 다룰 경우가 더 있지는 않다.
        <dl className="space-y-1.5">
          {source === 'secret_only' ? (
            <p className="text-caption-md text-warning">
              ⚠ 이 시크릿과 일치하는 드라마 계정을 찾지 못했습니다. 계정이 삭제됐거나 시크릿이 변경된 상태입니다.
            </p>
          ) : (
            <>
              <CredentialRow label="아이디" value={email} />
              <CredentialRow label="비밀번호" value={password} />
            </>
          )}
          <CredentialRow label="OTP 시크릿" value={otpSecret} />
          {(platform || dueAt) && (
            <CredentialRow
              label="계정"
              value={[platform, dueAt && `마감 ${dueAt}`].filter(Boolean).join(' · ')}
              mono={false}
            />
          )}
        </dl>
      )}

      {source === 'matched_by_secret' && (
        <p className="text-caption-sm text-text-muted">
          수동 등록된 시크릿으로 찾은 계정입니다 (자동 배정된 건이 아닙니다).
        </p>
      )}

      {ambiguous && (
        <p className="text-caption-md text-warning">
          ⚠ 같은 시크릿을 쓰는 계정이 여러 개입니다. 위 계정이 맞는지 직접 확인해 주세요.
        </p>
      )}

      {secretMismatch && (
        <div className="space-y-1.5 rounded-lg border border-danger/30 bg-white p-2.5">
          <p className="text-caption-md text-danger">
            ⚠ 계정의 현재 시크릿과 다릅니다 — <strong>구매자가 틀린 코드를 받습니다.</strong> 배정 이후 계정
            시크릿이 변경된 상태입니다.
          </p>
          {onSyncSecret && (
            <button
              type="button"
              onClick={onSyncSecret}
              disabled={syncing}
              className="text-caption-md rounded-lg border border-border bg-white px-2.5 py-1 font-medium text-text-primary transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {syncing ? '동기화 중...' : '계정 시크릿으로 동기화'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * 메모 원문을 드라마 계정 관리와 같은 모양으로 그린다 (읽기 전용).
 *
 * 그쪽 `MemoLines`에서 검색 하이라이트·파티원 삭제 버튼·OTP 「발급」 버튼·임박 배지를 뺐다.
 * 발급 버튼을 두지 않는 것은 기존 결정이다 — 구매자가 사이트·채팅으로 발급받는 구조(3회 한도)라
 * 관리자 화면에서는 시크릿 문자열만 보여준다.
 *
 * 폰트·행간은 드라마 카드와 같은 스펙을 쓴다 (같은 글자가 같은 모양으로 보여야 비교가 쉽다).
 */
function MemoBlock({
  lines,
  highlightMemberId,
}: {
  lines: MemoLine[]
  highlightMemberId: string | null
}) {
  return (
    <div className="max-h-56 overflow-auto rounded-lg border border-border bg-white px-3 py-2 font-mono text-[12.5px] leading-[22px] tabular-nums">
      {lines.map((line, index) => {
        // 줄 순서가 곧 정체성이라 index를 key로 쓴다 (같은 텍스트가 반복될 수 있음)
        const isMine = line.member != null && line.member.id === highlightMemberId
        return (
          <div
            key={`${line.kind}-${index}`}
            className={cn(
              '-mx-1.5 flex min-h-[22px] items-center gap-2 rounded px-1.5',
              isMine && 'bg-brand/10',
            )}
          >
            <span
              className={cn(
                'whitespace-pre',
                line.kind === 'head' && 'font-bold',
                (line.kind === 'free' || line.kind === 'note') && 'text-text-muted',
                line.member?.expired && 'text-text-muted line-through',
              )}
            >
              {line.text}
            </span>
            {line.member?.expired && (
              <span className="text-caption-sm bg-badge-red-bg text-badge-red-text shrink-0 rounded px-1.5 font-semibold">
                만료
              </span>
            )}
            {/* 파티원이 여럿이고 이름이 비슷하면 어느 줄이 이 신청인지 구분되지 않는다 */}
            {isMine && (
              <span className="text-caption-sm text-brand shrink-0 font-sans font-semibold">
                ← 이 신청
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CredentialRow({ label, value, mono = true }: { label: string; value: string | null; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <dt className="text-caption-md w-20 shrink-0 text-text-muted">{label}</dt>
      <dd
        className={
          mono
            ? 'text-caption-md break-all font-mono text-text-primary'
            : 'text-caption-md text-text-secondary'
        }
      >
        {value}
      </dd>
    </div>
  )
}
