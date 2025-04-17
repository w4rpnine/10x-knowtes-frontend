"use client"

import type React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  disableSwitch?: boolean
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Since your app is locked to dark mode (disableSwitch=true),
  // we can create a simplified provider that just renders children
  return <>{children}</>
}
