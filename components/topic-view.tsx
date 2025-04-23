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

export default function TopicView({ topicId }: TopicViewProps) {
  const [topic, setTopic] = useState<TopicData | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { showDeleteConfirmation } = useDeleteConfirmation()
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchTopic() {
      setIsLoading(true)
      try {
        // BACKEND INTEGRATION: Load topic data
        // This should fetch the topic details, including all notes and summaries
        // Example API call:
        // const response = await fetch(`http://localhost:3001/api/topics/${topicId}`);
        // if (!response.ok) {
        //   throw new Error("Failed to fetch topic");
        // }
        // const data = await response.json();
        // setTopic(data);
        // setNewTitle(data.title);
        // setIsLoading(false);

        // Mock data that matches the API response format
        const mockData: TopicData = {
          id: topicId,
          title: topicId === "topic-1" ? "Matematyka" : "Fizyka",
          created_at: "2023-05-10T10:00:00Z",
          updated_at: "2023-05-10T10:00:00Z",
          notes: [
            {
              id: "note-1",
              title: "Algebra liniowa",
              content: "Content of algebra liniowa",
              created_at: "2023-05-10T10:00:00Z",
              updated_at: "2023-05-10T10:00:00Z",
              is_summary: false,
            },
            {
              id: "note-2",
              title: "Rachunek różniczkowy",
              content: "Content of rachunek różniczkowy",
              created_at: "2023-05-12T14:30:00Z",
              updated_at: "2023-05-12T14:30:00Z",
              is_summary: false,
            },
            {
              id: "summary-1",
              title: "Podsumowanie matematyki",
              content: "Summary content of matematyka",
              created_at: "2023-05-15T09:15:00Z",
              updated_at: "2023-05-15T09:15:00Z",
              is_summary: true,
            },
          ],
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setTopic(mockData)
        setNewTitle(mockData.title)
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

  const handleGenerateSummary = () => {
    // BACKEND INTEGRATION: Generate summary for the topic
    // This should send a POST request to generate a summary for all notes in the topic
    // Example API call:
    // async function generateSummary() {
    //   try {
    //     const response = await fetch(`http://localhost:3001/api/topics/${topicId}/summary`, {
    //       method: 'POST',
    //     });
    //
    //     if (!response.ok) throw new Error('Failed to generate summary');
    //     const summary = await response.json();
    //
    //     // Navigate to the new summary
    //     router.push(`/topics/${topicId}/summary/${summary.id}`);
    //   } catch (error) {
    //     console.error('Failed to generate summary:', error);
    //     toast({
    //       title: t("topic.generateError"),
    //       description: t("topic.generateErrorDesc"),
    //       variant: "destructive",
    //     });
    //   }
    // }
    //
    // generateSummary();

    alert(t("topic.generatingSummary"))
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
      // BACKEND INTEGRATION: Update topic title
      // This should send a PUT request to update the topic title
      // Example API call:
      // const response = await fetch(`http://localhost:3001/api/topics/${topicId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ title: newTitle }),
      // });
      //
      // if (!response.ok) throw new Error('Failed to update topic');
      //
      // // Parse the response
      // const updatedTopic = await response.json();
      //
      // // Update local state with the response data
      // setTopic(prev => prev ? {
      //   ...prev,
      //   title: updatedTopic.title,
      //   updated_at: updatedTopic.updated_at
      // } : null);
      //
      // // Dispatch event to refresh the tree panel
      // const refreshTreeEvent = new Event("refreshTreePanel");
      // window.dispatchEvent(refreshTreeEvent);
      //
      // toast({
      //   title: t("topic.nameChanged"),
      //   description: t("topic.nameChangedDesc", { title: newTitle }),
      // });

      // Mock implementation
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock response
      const mockResponse = {
        id: topicId,
        title: newTitle,
        created_at: topic?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Update local state
      if (topic) {
        setTopic({
          ...topic,
          title: mockResponse.title,
          updated_at: mockResponse.updated_at,
        })
      }

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
      description: t("topic.deleteTopicConfirm", { title: topic.title }),
      onConfirm: async () => {
        try {
          // BACKEND INTEGRATION: Delete topic
          // This should send a DELETE request to remove the topic and all its notes/summaries
          // Example API call:
          // const response = await fetch(`http://localhost:3001/api/topics/${topicId}`, {
          //   method: 'DELETE',
          // });
          //
          // if (!response.ok) throw new Error('Failed to delete topic');
          //
          // // Check if we got the expected 204 response
          // if (response.status === 204) {
          //   // Dispatch event to refresh the tree panel
          //   const refreshTreeEvent = new Event("refreshTreePanel");
          //   window.dispatchEvent(refreshTreeEvent);
          //
          //   toast({
          //     title: t("topic.topicDeleted"),
          //     description: t("topic.topicDeletedDesc"),
          //   });
          //
          //   // Navigate to the dashboard (welcome view)
          //   router.push("/dashboard");
          // } else {
          //   throw new Error(`Unexpected response status: ${response.status}`);
          // }

          // Mock implementation
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Dispatch event to refresh the tree panel
          const refreshTreeEvent = new Event("refreshTreePanel")
          window.dispatchEvent(refreshTreeEvent)

          toast({
            title: t("topic.topicDeleted"),
            description: t("topic.topicDeletedDesc"),
          })

          // Navigate to the dashboard (welcome view)
          router.push("/dashboard")
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
          >
            <FileDown className="mr-2 h-4 w-4" />
            {t("topic.generateSummary")}
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
    </div>
  )
}
