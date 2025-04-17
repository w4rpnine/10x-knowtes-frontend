"use client"

import type React from "react"

import { DeleteConfirmationProvider } from "@/hooks/use-delete-confirmation"

export function Providers({ children }: { children: React.ReactNode }) {
  return <DeleteConfirmationProvider>{children}</DeleteConfirmationProvider>
}
