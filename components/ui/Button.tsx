import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
export type ButtonSize = 'default' | 'sm' | 'xs' | 'icon'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
  danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700',
  success: 'bg-success text-white hover:bg-emerald-600 active:bg-emerald-700',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: 'h-9 px-4 text-body-md',
  sm: 'h-8 px-3 text-caption-md',
  xs: 'h-6 px-2.5 text-caption-sm',
  icon: 'h-9 w-9 px-0',
}

export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {loading ? '처리 중...' : children}
    </button>
  )
}
