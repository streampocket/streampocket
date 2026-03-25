import { cn } from '@/lib/utils'

export type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'

type BadgeProps = {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  green: 'bg-badge-green-bg text-badge-green-text',
  yellow: 'bg-badge-yellow-bg text-badge-yellow-text',
  red: 'bg-badge-red-bg text-badge-red-text',
  blue: 'bg-badge-blue-bg text-badge-blue-text',
  gray: 'bg-badge-gray-bg text-badge-gray-text',
  purple: 'bg-badge-purple-bg text-badge-purple-text',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-caption-md inline-flex items-center rounded-full px-2 py-0.5 font-semibold',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
