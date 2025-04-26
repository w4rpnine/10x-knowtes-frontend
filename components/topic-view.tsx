"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { FileText, FileDown, Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { useTranslation } from "react-i18next"
import SummaryPreviewModal from "./summary-preview-modal"
import { API_BASE_URL } from "@/lib/config"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  is_summary: boolean
}

interface TopicData {
  id: string
  title: string
  created_at: string
  updated_at: string
  notes: Note[]
}

interface TopicViewProps {
  topicId: string
}

interface SummaryResponse {
  summary_stat_id: string
  title: string
  content: string
}

export default function TopicView({ topicId }: TopicViewProps) {
  const [topic, setTopic] = useState<TopicData | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryPreviewOpen, setSummaryPreviewOpen] = useState(false)
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { showDeleteConfirmation } = useDeleteConfirmation()
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchTopic() {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch topic")
        }
        const data = await response.json()
        setTopic(data)
        setNewTitle(data.title)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch topic:", error)
        toast({
          title: t("topic.fetchError"),
          description: t("topic.fetchErrorDesc"),
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTopic()
  }, [topicId, toast, t])

  const handleCreateNote = () => {
    // Navigate to the new note page
    router.push(`/topics/${topicId}/notes/new`)
  }

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true)
    try {
      // Make the POST request to generate a summary
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/summaries`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      // Parse the response
      const data: SummaryResponse = await response.json()

      // Store the summary data
      setSummaryData(data)

      // Open the summary preview modal
      setSummaryPreviewOpen(true)
    } catch (error) {
      console.error("Failed to generate summary:", error)
      toast({
        title: t("topic.generateError"),
        description: t("topic.generateErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleEditTitle = () => {
    setIsEditingTitle(true)
  }

  const handleSaveTitle = async () => {
    if (!newTitle.trim()) {
      toast({
        title: t("topic.error"),
        description: t("navigation.topicNameRequired"),
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      })

      if (!response.ok) throw new Error("Failed to update topic")

      // Parse the response
      const updatedTopic = await response.json()

      // Update local state with the response data
      setTopic((prev) =>
        prev
          ? {
              ...prev,
              title: updatedTopic.title,
              updated_at: updatedTopic.updated_at,
            }
          : null,
      )

      // Dispatch event to refresh the tree panel
      const refreshTreeEvent = new Event("refreshTreePanel")
      window.dispatchEvent(refreshTreeEvent)

      toast({
        title: t("topic.nameChanged"),
        description: t("topic.nameChangedDesc", { title: newTitle }),
      })
    } catch (error) {
      console.error("Failed to update topic:", error)
      toast({
        title: t("topic.updateError"),
        description: t("topic.updateErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      setIsEditingTitle(false)
    }
  }

  const handleDeleteTopic = () => {
    if (!topic) return

    showDeleteConfirmation({
      title: t("topic.deleteTopic"),
      description: t("topic.deleteTopicConfirm"),
      onConfirm: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`, {
            method: "DELETE",
          })

          if (!response.ok) throw new Error("Failed to delete topic")

          // Check if we got the expected 204 response
          if (response.status === 204) {
            // Dispatch event to refresh the tree panel
            const refreshTreeEvent = new Event("refreshTreePanel")
            window.dispatchEvent(refreshTreeEvent)

            toast({
              title: t("topic.topicDeleted"),
              description: t("topic.topicDeletedDesc"),
            })

            // Navigate to the dashboard (welcome view)
            router.push("/dashboard")
          } else {
            throw new Error(`Unexpected response status: ${response.status}`)
          }
        } catch (error) {
          console.error("Failed to delete topic:", error)
          toast({
            title: t("topic.deleteError"),
            description: t("topic.deleteErrorDesc"),
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

  if (!topic) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{t("topic.notFound")}</p>
      </div>
    )
  }

  // Separate notes and summaries
  const regularNotes = topic.notes.filter((note) => !note.is_summary)
  const summaries = topic.notes.filter((note) => note.is_summary)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="max-w-md border-neon-yellow/30 bg-black/30 focus-visible:ring-neon-yellow/50"
                autoFocus
                disabled={isSaving}
              />
              <Button
                onClick={handleSaveTitle}
                size="icon"
                className="h-8 w-8 bg-neon-green hover:bg-neon-green/90"
                aria-label={t("topic.save")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsEditingTitle(false)
                  setNewTitle(topic.title)
                }}
                size="icon"
                variant="outline"
                className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
                aria-label={t("navigation.cancel")}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="text-neon-yellow glow-text font-medium text-xl">
                  {topic.title}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateNote} className="bg-gradient-to-r from-neon-blue to-neon-cyan hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            {t("topic.newNote")}
          </Button>
          <Button
            onClick={handleGenerateSummary}
            variant="outline"
            className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
            disabled={regularNotes.length === 0 || isGeneratingSummary}
          >
            {isGeneratingSummary ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("topic.generatingSummary")}
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                {t("topic.generateSummary")}
              </>
            )}
          </Button>
          <Button
            onClick={handleEditTitle}
            variant="outline"
            className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("topic.rename")}
          </Button>
          <Button
            onClick={handleDeleteTopic}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("topic.delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {regularNotes.map((note) => (
          <Link key={note.id} href={`/topics/${topicId}/notes/${note.id}`}>
            <Card className="fancy-card hover:bg-black/40 transition-colors border-neon-blue/20 bg-black/30">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4 note-icon" />
                    <span className="text-neon-blue">{note.title}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {summaries.map((summary) => (
          <Link key={summary.id} href={`/topics/${topicId}/summary/${summary.id}`}>
            <Card className="fancy-card hover:bg-black/40 transition-colors border-neon-purple/30 bg-black/30">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <FileDown className="mr-2 h-4 w-4 summary-icon" />
                    <span className="text-neon-purple glow-text">{summary.title}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(summary.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {regularNotes.length === 0 && summaries.length === 0 && (
          <Card className="fancy-card bg-black/30">
            <CardContent className="p-6 text-center text-muted-foreground">{t("topic.noNotesYet")}</CardContent>
          </Card>
        )}
      </div>

      {/* Summary Preview Modal */}
      {summaryData && (
        <SummaryPreviewModal
          open={summaryPreviewOpen}
          onOpenChange={setSummaryPreviewOpen}
          summary_stat_id={summaryData.summary_stat_id}
          initialTitle={summaryData.title}
          initialContent={summaryData.content}
          topicId={topicId}
        />
      )}
    </div>
  )
}
