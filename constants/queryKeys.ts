export const QUERY_KEYS = {
  orders: {
    all: () => ['orders'] as const,
    list: (params?: Record<string, unknown>) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
  },
  orderTracking: {
    detail: (productOrderId: string) => ['orderTracking', productOrderId] as const,
  },
  // 자동 친구링크 폼의 자격증명 프리필에 사용
  steamRegistrations: {
    byOrder: (orderItemId: string) => ['steamRegistrations', 'byOrder', orderItemId] as const,
  },
  products: {
    all: () => ['products'] as const,
    list: (params?: Record<string, unknown>) => ['products', params] as const,
    detail: (id: string) => ['products', id] as const,
  },
  games: {
    all: () => ['games'] as const,
    list: (params?: Record<string, unknown>) => ['games', params] as const,
  },
  accounts: {
    all: () => ['accounts'] as const,
    list: (params?: Record<string, unknown>) => ['accounts', params] as const,
  },
  dashboard: {
    stats: (period?: string, store?: string) => ['dashboard', 'stats', period, store] as const,
    revenueChart: (days?: number, store?: string) =>
      ['dashboard', 'revenueChart', days, store] as const,
    extras: (store?: string) => ['dashboard', 'extras', store] as const,
  },
  settings: {
    system: () => ['settings', 'system'] as const,
  },
  alimtalk: {
    settings: (store?: string) => ['alimtalk', 'settings', store] as const,
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
    detail: (id: string) => ['ownProducts', id] as const,
  },
  partyApplications: {
    check: (productId: string) => ['partyApplications', 'check', productId] as const,
    my: () => ['partyApplications', 'my'] as const,
  },
  adminParties: {
    all: () => ['adminParties'] as const,
    list: (params?: Record<string, unknown>) => ['adminParties', 'list', params] as const,
    detail: (id: string) => ['adminParties', id] as const,
  },
  adminGcoinProducts: {
    all: () => ['adminGcoinProducts'] as const,
    list: (params?: Record<string, unknown>) => ['adminGcoinProducts', 'list', params] as const,
    detail: (id: string) => ['adminGcoinProducts', id] as const,
  },
  ownRuleTemplates: {
    all: () => ['ownRuleTemplates'] as const,
    list: () => ['ownRuleTemplates', 'list'] as const,
  },
  adminApplications: {
    all: () => ['adminApplications'] as const,
    list: (params?: Record<string, unknown>) => ['adminApplications', 'list', params] as const,
    detail: (id: string) => ['adminApplications', id] as const,
  },
  adminUsers: {
    all: () => ['adminUsers'] as const,
    list: (params?: Record<string, unknown>) => ['adminUsers', 'list', params] as const,
    detail: (id: string) => ['adminUsers', id] as const,
  },
  ownReviews: {
    all: () => ['ownReviews'] as const,
    list: (params?: Record<string, unknown>) => ['ownReviews', 'list', params] as const,
    detail: (id: string) => ['ownReviews', id] as const,
    eligible: () => ['ownReviews', 'eligible'] as const,
  },
  adminOwnReviews: {
    all: () => ['adminOwnReviews'] as const,
    list: (params?: Record<string, unknown>) => ['adminOwnReviews', 'list', params] as const,
  },
  community: {
    all: () => ['community'] as const,
    list: (params?: Record<string, unknown>) => ['community', 'list', params] as const,
    detail: (id: string) => ['community', 'detail', id] as const,
  },
  adminCommunity: {
    all: () => ['adminCommunity'] as const,
    list: (params?: Record<string, unknown>) => ['adminCommunity', 'list', params] as const,
  },
} as const
