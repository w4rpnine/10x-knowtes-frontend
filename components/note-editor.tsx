"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Save, Trash2, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { useTranslation } from "react-i18next"

interface Note {
  id: string
  topic_id: string
  title: string
  content: string
  is_summary: boolean
  created_at: string
  updated_at: string
}

interface TopicInfo {
  id: string
  title: string
}

interface NoteEditorProps {
  topicId: string
  noteId: string
}

export default function NoteEditor({ topicId, noteId }: NoteEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { showDeleteConfirmation } = useDeleteConfirmation()
  const { t } = useTranslation()
  const [note, setNote] = useState<Note | null>(null)
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Store original values for discard functionality
  const originalTitle = useRef("")
  const originalContent = useRef("")

  // Replace the fetchNote function with real API call
  async function fetchNote() {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch note")
      }
      const data = await response.json()
      setNote(data)
      setTitle(data.title)
      setContent(data.content)

      // Store original values for discard functionality
      originalTitle.current = data.title
      originalContent.current = data.content

      // Fetch topic info to get the topic title
      const topicResponse = await fetch(`http://localhost:3001/api/topics/${data.topic_id}/info`)
      if (!topicResponse.ok) {
        throw new Error("Failed to fetch topic info")
      }
      const topicData = await topicResponse.json()
      setTopicInfo(topicData)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch note:", error)
      toast({
        title: t("note.fetchError"),
        description: t("note.fetchErrorDesc"),
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNote()
  }, [noteId, topicId, toast, t])

  useEffect(() => {
    // Warn before leaving with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setHasUnsavedChanges(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setHasUnsavedChanges(true)
  }

  // Replace the handleSave function with real API call
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: t("note.error"),
        description: t("note.titleRequired"),
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      })

      if (!response.ok) throw new Error("Failed to save note")
      const updatedNote = await response.json()

      // Update the note in state
      setNote(updatedNote)

      // Update original values after successful save
      originalTitle.current = updatedNote.title
      originalContent.current = updatedNote.content

      // Dispatch event to refresh the tree panel
      const refreshTreeEvent = new Event("refreshTreePanel")
      window.dispatchEvent(refreshTreeEvent)

      setHasUnsavedChanges(false)

      toast({
        title: t("note.saved"),
        description: t("note.savedDesc"),
      })
    } catch (error) {
      console.error("Failed to save note:", error)
      toast({
        title: t("note.saveError"),
        description: t("note.saveErrorDesc"),
        variant: "destructive",
      })
    }
  }

  const handleDiscardChanges = () => {
    // Reset to original values
    setTitle(originalTitle.current)
    setContent(originalContent.current)
    setHasUnsavedChanges(false)

    toast({
      title: t("note.changesDiscarded"),
      description: t("note.changesDiscardedDesc"),
    })
  }

  // Replace the handleDeleteNote function with real API call
  const handleDeleteNote = () => {
    showDeleteConfirmation({
      title: t("note.deleteNote"),
      description: t("note.deleteNoteConfirm", { title }),
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/notes/${noteId}`, {
            method: "DELETE",
          })

          if (!response.ok) throw new Error("Failed to delete note")

          // Check if we got the expected 204 response
          if (response.status === 204) {
            // Dispatch event to refresh the tree panel
            const refreshTreeEvent = new Event("refreshTreePanel")
            window.dispatchEvent(refreshTreeEvent)

            toast({
              title: t("note.noteDeleted"),
              description: t("note.noteDeletedDesc"),
            })

            // Navigate to the topic view
            router.push(`/topics/${topicId}`)
          } else {
            throw new Error(`Unexpected response status: ${response.status}`)
          }
        } catch (error) {
          console.error("Failed to delete note:", error)
          toast({
            title: t("note.deleteError"),
            description: t("note.deleteErrorDesc"),
            variant: "destructive",
          })
        }
      },
    })
  }

  const handleNavigateToTopic = () => {
    if (hasUnsavedChanges) {
      if (confirm(t("note.unsavedChanges"))) {
        router.push(`/topics/${topicId}`)
      }
    } else {
      router.push(`/topics/${topicId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
      </div>
    )
  }

  if (!note || !topicInfo) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{t("note.notFound")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-neon-yellow glow-text hover:underline cursor-pointer"
                  onClick={handleNavigateToTopic}
                >
                  <span>{topicInfo.title}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-neon-blue glow-text">{title}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90"
          >
            <Save className="mr-2 h-4 w-4" />
            {t("note.save")}
          </Button>
          <Button
            onClick={handleDiscardChanges}
            disabled={!hasUnsavedChanges}
            variant="outline"
            className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("note.discardChanges")}
          </Button>
          <Button
            onClick={handleDeleteNote}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("note.deleteNote")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder={t("note.noteTitle")}
          className="text-lg font-medium border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
        />

        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder={t("note.noteContent")}
          className="min-h-[60vh] font-mono border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
          rows={20}
        />
      </div>
    </div>
  )
}
