"use client"

import type React from "react"
import { useEffect } from "react"
import { DeleteConfirmationProvider } from "@/hooks/use-delete-confirmation"
import "@/lib/i18n" // Import i18n configuration

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize i18n
  useEffect(() => {
    // This effect ensures i18n is initialized on the client side
  }, [])

  return <DeleteConfirmationProvider>{children}</DeleteConfirmationProvider>
}
