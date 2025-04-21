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

interface TopicViewProps {
  topicId: string
}

// Mock data
const mockTopic = {
  id: "topic-1",
  title: "Matematyka",
  notes: [
    { id: "note-1", title: "Algebra liniowa", createdAt: "2023-05-10T10:00:00Z" },
    { id: "note-2", title: "Rachunek różniczkowy", createdAt: "2023-05-12T14:30:00Z" },
  ],
  summaries: [{ id: "summary-1", title: "Podsumowanie matematyki", createdAt: "2023-05-15T09:15:00Z" }],
}

export default function TopicView({ topicId }: TopicViewProps) {
  const [topic, setTopic] = useState(mockTopic)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState(topic.title)
  const router = useRouter()
  const { toast } = useToast()
  const { showDeleteConfirmation } = useDeleteConfirmation()
  const { t } = useTranslation()

  useEffect(() => {
    // BACKEND INTEGRATION: Load topic data
    // This should fetch the topic details, including all notes and summaries
    // Example API call:
    // async function fetchTopic() {
    //   try {
    //     const response = await fetch(`/api/topics/${topicId}`);
    //     const data = await response.json();
    //     setTopic(data);
    //     setNewTitle(data.title);
    //   } catch (error) {
    //     console.error('Failed to fetch topic:', error);
    //     toast({
    //       title: "Błąd",
    //       description: "Nie udało się załadować tematu",
    //       variant: "destructive",
    //     });
    //   }
    // }
    //
    // fetchTopic();
  }, [topicId, toast])

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
    //     const response = await fetch(`/api/topics/${topicId}/summary`, {
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
    //       title: "Błąd",
    //       description: "Nie udało się wygenerować podsumowania",
    //       variant: "destructive",
    //     });
    //   }
    // }
    //
    // generateSummary();

    alert("Generowanie podsumowania")
  }

  const handleEditTitle = () => {
    setIsEditingTitle(true)
  }

  const handleSaveTitle = async () => {
    // BACKEND INTEGRATION: Update topic title
    // This should send a PATCH/PUT request to update the topic title
    // Example API call:
    // try {
    //   const response = await fetch(`/api/topics/${topicId}`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ title: newTitle }),
    //   });
    //
    //   if (!response.ok) throw new Error('Failed to update topic');
    //
    //   // Update local state
    //   setTopic(prev => ({ ...prev, title: newTitle }));
    //
    //   // BACKEND INTEGRATION: Reload the navigation tree after updating topic
    //   // This should trigger a refresh of the navigation tree component
    //   // Example: eventEmitter.emit('refreshNavigationTree');
    //
    //   toast({
    //     title: "Nazwa zmieniona",
    //     description: `Nazwa tematu została zmieniona na "${newTitle}"`,
    //   });
    // } catch (error) {
    //   console.error('Failed to update topic:', error);
    //   toast({
    //     title: "Błąd",
    //     description: "Nie udało się zmienić nazwy tematu",
    //     variant: "destructive",
    //   });
    // }

    // Implementation for saving the new title
    toast({
      title: t("topic.nameChanged"),
      description: t("topic.nameChangedDesc", { title: newTitle }),
    })
    setIsEditingTitle(false)
  }

  const handleDeleteTopic = () => {
    showDeleteConfirmation({
      title: t("topic.deleteTopic"),
      description: t("topic.deleteTopicConfirm", { title: topic.title }),
      onConfirm: async () => {
        // BACKEND INTEGRATION: Delete topic
        // This should send a DELETE request to remove the topic and all its notes/summaries
        // Example API call:
        // try {
        //   const response = await fetch(`/api/topics/${topicId}`, {
        //     method: 'DELETE',
        //   });
        //
        //   if (!response.ok) throw new Error('Failed to delete topic');
        //
        //   // BACKEND INTEGRATION: Reload the navigation tree after deleting topic
        //   // This should trigger a refresh of the navigation tree component
        //   // Example: eventEmitter.emit('refreshNavigationTree');
        //
        //   toast({
        //     title: "Temat usunięty",
        //     description: "Temat został pomyślnie usunięty",
        //   });
        //
        //   router.push("/dashboard");
        // } catch (error) {
        //   console.error('Failed to delete topic:', error);
        //   toast({
        //     title: "Błąd",
        //     description: "Nie udało się usunąć tematu",
        //     variant: "destructive",
        //   });
        // }

        // Implementation for deleting a topic
        toast({
          title: t("topic.topicDeleted"),
          description: t("topic.topicDeletedDesc"),
        })
        router.push("/dashboard")
      },
    })
  }

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
              />
              <Button
                onClick={handleSaveTitle}
                size="icon"
                className="h-8 w-8 bg-neon-green hover:bg-neon-green/90"
                aria-label="Zapisz"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  setIsEditingTitle(false)
                  setNewTitle(topic.title)
                }}
                size="icon"
                variant="outline"
                className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
                aria-label="Anuluj"
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
        {topic.notes.map((note) => (
          <Link key={note.id} href={`/topics/${topicId}/notes/${note.id}`}>
            <Card className="fancy-card hover:bg-black/40 transition-colors border-neon-blue/20 bg-black/30">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4 note-icon" />
                    <span className="text-neon-blue">{note.title}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {topic.summaries.map((summary) => (
          <Link key={summary.id} href={`/topics/${topicId}/summary/${summary.id}`}>
            <Card className="fancy-card hover:bg-black/40 transition-colors border-neon-purple/30 bg-black/30">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <FileDown className="mr-2 h-4 w-4 summary-icon" />
                    <span className="text-neon-purple glow-text">{summary.title}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {topic.notes.length === 0 && topic.summaries.length === 0 && (
          <Card className="fancy-card bg-black/30">
            <CardContent className="p-6 text-center text-muted-foreground">{t("topic.noNotesYet")}</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
