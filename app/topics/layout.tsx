import type React from "react"
import MainLayout from "@/components/layouts/main-layout"

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
