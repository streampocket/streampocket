import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  iconBg?: string
  className?: string
}

export function StatCard({ label, value, sub, icon, iconBg, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card-bg p-5',
        'shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]',
        className,
      )}
    >
      <p className="text-caption-md mb-1 text-text-secondary">{label}</p>
      <p className="text-display font-bold text-text-primary">{value}</p>
      {sub && <p className="text-caption-md mt-1 text-text-muted">{sub}</p>}
      {icon && (
        <div
          className={cn(
            'absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-lg text-xl opacity-15',
            iconBg,
          )}
        >
          {icon}
        </div>
      )}
    </div>
  )
}
