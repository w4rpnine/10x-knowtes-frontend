"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Save, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface NewNoteEditorProps {
  topicId: string
}

// Mock data for the topic
const mockTopics = {
  "topic-1": { title: "Matematyka" },
  "topic-2": { title: "Fizyka" },
}

export default function NewNoteEditor({ topicId }: NewNoteEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [topicTitle, setTopicTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // BACKEND INTEGRATION: Load topic data for the breadcrumb
    // This should fetch just the topic title for display in the breadcrumb
    // Example API call:
    // async function fetchTopicTitle() {
    //   try {
    //     const response = await fetch(`/api/topics/${topicId}/title`);
    //     const data = await response.json();
    //     setTopicTitle(data.title);
    //   } catch (error) {
    //     console.error('Failed to fetch topic title:', error);
    //     toast({
    //       title: "Błąd",
    //       description: "Nie udało się załadować nazwy tematu",
    //       variant: "destructive",
    //     });
    //   }
    // }
    //
    // fetchTopicTitle();

    // In a real app, fetch topic data here
    const mockTopic = mockTopics[topicId as keyof typeof mockTopics]
    if (mockTopic) {
      setTopicTitle(mockTopic.title)
    }
  }, [topicId, toast])

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

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Błąd",
        description: t("note.titleRequired"),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // BACKEND INTEGRATION: Create a new note
      // This should send a POST request to create a new note with the given title and content
      // Example API call:
      // const response = await fetch(`/api/topics/${topicId}/notes`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: title,
      //     content: content
      //   }),
      // });
      //
      // if (!response.ok) throw new Error('Failed to create note');
      // const newNote = await response.json();

      // In a real app, save note data here
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Generate a mock ID for the new note
      const newNoteId = `note-${Date.now()}`

      // BACKEND INTEGRATION: Reload the navigation tree after creating a note
      // This should trigger a refresh of the navigation tree component
      // Example: eventEmitter.emit('refreshNavigationTree');

      toast({
        title: t("note.noteCreated"),
        description: t("note.noteCreatedDesc"),
      })

      // Navigate to the new note
      router.push(`/topics/${topicId}/notes/${newNoteId}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: t("note.createError"),
        variant: "destructive",
      })
      setIsCreating(false)
    }
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
                  <span>{topicTitle}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-neon-blue glow-text">{t("note.newNote")}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSave}
            disabled={isCreating}
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isCreating ? t("navigation.creating") : t("note.save")}
          </Button>
          <Button
            disabled={true}
            variant="outline"
            className="border-amber-500 text-amber-500/50 hover:bg-amber-500/10 cursor-not-allowed"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("note.discardChanges")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder={t("note.noteTitle")}
          className="text-lg font-medium border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
          autoFocus
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
