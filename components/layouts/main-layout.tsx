"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import NavigationTree from "@/components/navigation-tree"
import UserAccountButton from "@/components/user-account-button"
import LanguageSwitcher from "@/components/language-switcher"
import { isAuthenticated } from "@/lib/auth-utils"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isAuthenticated()) {
        router.push("/login")
      } else {
        setIsUserAuthenticated(true)
        setIsLoading(false)
      }
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
      </div>
    )
  }

  if (!isUserAuthenticated) {
    return null
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="flex flex-col h-full border-r">
          <NavigationTree />
        </div>
      </ResizablePanel>
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <header className="border-b p-4 flex justify-between items-center">
            <LanguageSwitcher />
            <UserAccountButton />
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
