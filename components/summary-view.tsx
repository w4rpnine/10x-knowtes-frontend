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
import { Copy, Trash2 } from "lucide-react"
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

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(`http://localhost:3001/api/topics/${topicId}/summaries/${summaryId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch summary")
        }
        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error("Failed to fetch summary:", error)
        toast({
          title: "Błąd",
          description: "Nie udało się załadować podsumowania",
          variant: "destructive",
        })
      }
    }

    fetchSummary()
  }, [summaryId, topicId, toast])

  const handleAccept = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/topics/${topicId}/summaries/${summaryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      })

      if (!response.ok) throw new Error("Failed to accept summary")

      toast({
        title: t("summary.summaryAccepted"),
        description: t("summary.summaryAcceptedDesc"),
      })
      router.push(`/topics/${topicId}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaakceptować podsumowania.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/topics/${topicId}/summaries/${summaryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      })

      if (!response.ok) throw new Error("Failed to reject summary")

      toast({
        title: t("summary.summaryRejected"),
        description: t("summary.summaryRejectedDesc"),
      })
      router.push(`/topics/${topicId}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się odrzucić podsumowania.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.content)
    toast({
      title: t("summary.copied"),
      description: t("summary.copiedDesc"),
    })
  }

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
            size="icon"
            onClick={handleCopy}
            className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">{t("summary.copy")}</span>
          </Button>
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
