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

interface Summary {
  id: string
  title: string
  content: string
  topic_id: string
  topic_title: string
  created_at: string
}

export default function SummaryView({ topicId, summaryId }: SummaryViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const { showDeleteConfirmation } = useDeleteConfirmation()

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(`http://localhost:3001/api/notes/${summaryId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch summary")
        }
        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error("Failed to fetch summary:", error)
        toast({
          title: t("summary.error"),
          description: t("summary.fetchError"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [summaryId, toast, t])

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{t("summary.notFound")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-neon-yellow glow-text hover:underline cursor-pointer">
                <Link href={`/topics/${topicId}`}>{summary.topic_title}</Link>
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
