"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"

interface SummaryViewProps {
  topicId: string
  summaryId: string
}

// Mock data
const mockSummary = {
  id: "summary-1",
  title: "Podsumowanie matematyki",
  content:
    "# Podsumowanie matematyki\n\n## Algebra liniowa\nAlgebra liniowa to dział matematyki zajmujący się badaniem przestrzeni liniowych oraz przekształceń liniowych. Kluczowe pojęcia to macierze i wektory.\n\n## Rachunek różniczkowy\nRachunek różniczkowy to dział analizy matematycznej zajmujący się badaniem zmian funkcji. Główne pojęcia to pochodna i całka.",
  topicId: "topic-1",
  topicTitle: "Matematyka",
  createdAt: "2023-05-15T09:15:00Z",
  status: "pending", // pending, accepted, rejected
}

export default function SummaryView({ topicId, summaryId }: SummaryViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [summary, setSummary] = useState(mockSummary)
  const { t } = useTranslation()

  const { showDeleteConfirmation } = useDeleteConfirmation()

  const handleDeleteSummary = () => {
    showDeleteConfirmation({
      title: t("summary.deleteSummary"),
      description: t("summary.deleteSummaryConfirm"),
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/notes/${summaryId}`, {
            method: "DELETE",
          })

          if (!response.ok) throw new Error("Failed to delete summary")

          // Check if we got the expected 204 response
          if (response.status === 204) {
            // Dispatch event to refresh the tree panel
            const refreshTreeEvent = new Event("refreshTreePanel")
            window.dispatchEvent(refreshTreeEvent)

            toast({
              title: t("summary.summaryDeleted"),
              description: t("summary.summaryDeletedDesc"),
            })

            // Navigate back to the topic view
            router.push(`/topics/${topicId}`)
          } else {
            throw new Error(`Unexpected response status: ${response.status}`)
          }
        } catch (error) {
          console.error("Failed to delete summary:", error)
          toast({
            title: t("summary.deleteError"),
            description: t("summary.deleteErrorDesc"),
            variant: "destructive",
          })
        }
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-neon-yellow glow-text hover:underline cursor-pointer">
                <Link href={`/topics/${topicId}`}>{summary.topicTitle}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-neon-purple glow-text">{summary.title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleDeleteSummary}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("summary.deleteSummary")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={summary.content}
          readOnly
          className="min-h-[60vh] font-mono bg-black/40 border-neon-purple/30 text-neon-purple/90"
          rows={20}
        />
      </div>
    </div>
  )
}
