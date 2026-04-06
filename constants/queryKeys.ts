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
  settings: {},
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
  manualRevenues: {
    all: () => ['manualRevenues'] as const,
    list: (params?: Record<string, unknown>) => ['manualRevenues', params] as const,
  },
  userAuth: {
    me: () => ['userAuth', 'me'] as const,
  },
  ownCategories: {
    all: () => ['ownCategories'] as const,
    list: () => ['ownCategories', 'list'] as const,
  },
  ownProducts: {
    all: () => ['ownProducts'] as const,
    list: (params?: Record<string, unknown>) => ['ownProducts', 'list', params] as const,
    my: () => ['ownProducts', 'my'] as const,
    detail: (id: string) => ['ownProducts', id] as const,
  },
  partner: {
    me: () => ['partner', 'me'] as const,
  },
  adminPartners: {
    all: () => ['adminPartners'] as const,
    list: (params?: Record<string, unknown>) => ['adminPartners', 'list', params] as const,
    detail: (id: string) => ['adminPartners', id] as const,
  },
} as const
