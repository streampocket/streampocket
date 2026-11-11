// 직원(staff) 관리자 페이지 권한 — be(streampocketBE/src/constants/adminPermissions.ts)와 키·순서가 같아야 한다.
// 여기에 항목을 추가하면 직원 관리 화면 체크박스에 자동으로 나타난다.
export const ADMIN_PERMISSIONS = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'orders', label: '주문 관리' },
  { key: 'products', label: '상품 관리' },
  { key: 'accounts', label: '계정 관리' },
  { key: 'reviewCodes', label: '리뷰 게임 관리' },
  { key: 'revenue', label: '매출 관리' },
  { key: 'users', label: '회원 관리' },
  { key: 'parties', label: '파티 관리' },
  { key: 'drama', label: '드라마 계정 관리' },
  { key: 'applications', label: '신청 관리' },
  { key: 'reviews', label: '리뷰 관리' },
  { key: 'otp', label: 'OTP 발급' },
  { key: 'community', label: '게시글 관리' },
  { key: 'gcoinProducts', label: '배그상품 관리' },
  { key: 'gcoinOrders', label: '배그주문 관리' },
  { key: 'visits', label: '방문자 통계' },
  { key: 'alimtalk', label: '알림톡' },
] as const // 단언 사유: 객체 리터럴 값을 좁은 리터럴 타입으로 고정하기 위한 const assertion

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number]['key']

// 페이지 접근 조건 — 권한 키 또는 사장 전용('owner')
export type PageAccess = AdminPermission | 'owner'

export type AdminRole = 'owner' | 'staff'

export type AdminMe = {
  id: string
  email: string
  role: AdminRole
  permissions: string[]
}

export function hasAccess(me: AdminMe, access: PageAccess): boolean {
  if (me.role === 'owner') return true
  if (access === 'owner') return false
  return me.permissions.includes(access)
}

export function isAdminPermission(value: string): value is AdminPermission {
  return ADMIN_PERMISSIONS.some((permission) => permission.key === value)
}
