export const QUERY_KEYS = {
  orders: {
    all: () => ['orders'] as const,
    list: (params?: Record<string, unknown>) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
  },
  products: {
    all: () => ['products'] as const,
    list: (params?: Record<string, unknown>) => ['products', params] as const,
    detail: (id: string) => ['products', id] as const,
  },
  accounts: {
    all: () => ['accounts'] as const,
    list: (params?: Record<string, unknown>) => ['accounts', params] as const,
  },
  dashboard: {
    stats: (period?: string) => ['dashboard', 'stats', period] as const,
  },
  settings: {
    alimtalkCost: () => ['settings', 'alimtalk-cost'] as const,
  },
  alimtalk: {
    settings: () => ['alimtalk', 'settings'] as const,
  },
  reviewCodes: {
    all: () => ['reviewCodes'] as const,
    list: (params?: Record<string, unknown>) => ['reviewCodes', params] as const,
  },
  expenses: {
    all: () => ['expenses'] as const,
    list: (params?: Record<string, unknown>) => ['expenses', params] as const,
    summary: (params?: Record<string, unknown>) => ['expenses', 'summary', params] as const,
  },
} as const
