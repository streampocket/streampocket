import { cn } from '@/lib/utils'

type OrderStepIndicatorProps = {
  /** 현재 단계 (1: 대기, 2: 진행중, 3: 완료) */
  currentStep: 1 | 2 | 3
  /** 마지막 단계까지 완료되었는지 여부 */
  done: boolean
}

const STEPS = [
  { step: 1, label: '대기' },
  { step: 2, label: '진행중' },
  { step: 3, label: '완료' },
] as const

export function OrderStepIndicator({ currentStep, done }: OrderStepIndicatorProps) {
  return (
    <ol className="flex items-start">
      {STEPS.map(({ step, label }, idx) => {
        const isReached = step <= currentStep
        const isComplete = step < currentStep || (step === currentStep && done)
        const isCurrent = step === currentStep && !done

        return (
          <li key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {idx > 0 ? (
                <div
                  className={cn(
                    'flex-1 border-t-2 border-dashed',
                    isReached ? 'border-brand' : 'border-border',
                  )}
                />
              ) : (
                <div className="flex-1" />
              )}
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                  'text-body-md font-bold transition-colors',
                  isReached
                    ? 'bg-brand text-white'
                    : 'border border-border bg-gray-100 text-text-muted',
                  isCurrent && 'ring-4 ring-brand-light',
                )}
              >
                {isComplete ? '✓' : step}
              </div>
              {idx < STEPS.length - 1 ? (
                <div
                  className={cn(
                    'flex-1 border-t-2 border-dashed',
                    step < currentStep ? 'border-brand' : 'border-border',
                  )}
                />
              ) : (
                <div className="flex-1" />
              )}
            </div>
            <span
              className={cn(
                'mt-2 text-caption-md',
                isReached ? 'font-semibold text-brand' : 'text-text-muted',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
