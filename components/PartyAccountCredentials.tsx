'use client'

import { Badge } from '@/components/ui/Badge'
import type { PartyAccountCredentials as Credentials } from '@/types/domain'

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
  const { source, email, password, otpSecret, platform, dueAt, secretMismatch, ambiguous } = credentials

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
