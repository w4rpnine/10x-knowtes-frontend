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
import { Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface NewNoteEditorProps {
  topicId: string
}

interface TopicInfo {
  id: string
  title: string
}

interface NoteResponse {
  id: string
  topic_id: string
  title: string
  content: string
  is_summary: boolean
  created_at: string
  updated_at: string
}

export default function NewNoteEditor({ topicId }: NewNoteEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchTopicInfo() {
      try {
        // BACKEND INTEGRATION: Load topic data for the breadcrumb
        // This should fetch just the topic title for display in the breadcrumb
        // Example API call:
        // const response = await fetch(`http://localhost:3001/api/topics/${topicId}/info`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch topic info');
        // }
        // const data = await response.json();
        // setTopicInfo(data);
        // setIsLoading(false);

        // Mock topic info
        const mockTopicInfo: TopicInfo = {
          id: topicId,
          title: topicId === "topic-1" ? "Matematyka" : "Fizyka",
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        setTopicInfo(mockTopicInfo)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch topic info:", error)
        toast({
          title: t("topic.fetchError"),
          description: t("topic.fetchErrorDesc"),
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTopicInfo()
  }, [topicId, toast, t])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleCancel = () => {
    router.push(`/topics/${topicId}`)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: t("note.error"),
        description: t("note.titleRequired"),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // BACKEND INTEGRATION: Create a new note
      // const response = await fetch(`http://localhost:3001/api/topics/${topicId}/notes`, {
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
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(errorData.message || 'Failed to create note');
      // }
      //
      // const newNote: NoteResponse = await response.json();
      //
      // // Show success notification
      // toast({
      //   title: t("note.noteCreated"),
      //   description: t("note.noteCreatedDesc"),
      // });
      //
      // // Navigate to the new note
      // router.push(`/topics/${topicId}/notes/${newNote.id}`);

      // Mock API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock response that matches the expected API response format
      const mockResponse: NoteResponse = {
        id: `note-${Date.now()}`,
        topic_id: topicId,
        title: title,
        content: content,
        is_summary: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Show success notification
      toast({
        title: t("note.noteCreated"),
        description: t("note.noteCreatedDesc"),
      })

      // Navigate to the new note
      router.push(`/topics/${topicId}/notes/${mockResponse.id}`)
    } catch (error) {
      console.error("Failed to create note:", error)
      toast({
        title: t("note.error"),
        description: t("note.createError"),
        variant: "destructive",
      })
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
      </div>
    )
  }

  if (!topicInfo) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{t("topic.notFound")}</p>
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
                  onClick={handleCancel}
                >
                  <span>{topicInfo.title}</span>
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
            onClick={handleCancel}
            disabled={isCreating}
            variant="outline"
            className="border-muted-foreground text-muted-foreground hover:bg-muted/10"
          >
            <X className="mr-2 h-4 w-4" />
            {t("navigation.cancel")}
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
