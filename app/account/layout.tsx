import type React from "react"
import MainLayout from "@/components/layouts/main-layout"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
