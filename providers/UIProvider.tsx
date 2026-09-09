'use client'

import { createContext, useContext, useState } from 'react'

type UIContextValue = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

type UIProviderProps = {
  children: React.ReactNode
}

export function UIProvider({ children }: UIProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    // Toaster는 여기 두지 않는다 — app/layout.tsx가 UIProvider 안에서 한 번 더 렌더해
    // 모든 토스트가 두 번 뜨고 있었다. 스타일을 지정한 layout 쪽 하나만 남긴다.
    <UIContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI는 UIProvider 안에서만 사용 가능합니다.')
  return ctx
}
