export const QUERY_KEYS = {
  orders: {
    list: (params?: Record<string, unknown>) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
  },
  products: {
    list: (params?: Record<string, unknown>) => ['products', params] as const,
    detail: (id: string) => ['products', id] as const,
  },
  accounts: {
    list: (params?: Record<string, unknown>) => ['accounts', params] as const,
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
  },
  settings: {
    emailTemplate: () => ['settings', 'emailTemplate'] as const,
  },
} as const
