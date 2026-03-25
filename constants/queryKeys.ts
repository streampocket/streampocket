export const QUERY_KEYS = {
  orders: {
    list: (params?: Record<string, unknown>) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
  },
  products: {
    list: () => ['products'] as const,
    detail: (id: string) => ['products', id] as const,
  },
  codes: {
    list: (productId?: string) => ['codes', productId] as const,
    detail: (id: string) => ['codes', id] as const,
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
  },
} as const
