import { cn } from '@/lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card-bg',
        'shadow-[0_1px_3px_rgba(0,0,0,.08),0_1px_2px_rgba(0,0,0,.06)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('flex items-center justify-between border-b border-border px-5 py-4', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: CardProps) {
  return <div className={cn('p-5', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('border-t border-border px-5 py-3', className)}>{children}</div>
  )
}
