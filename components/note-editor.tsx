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
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

interface NoteEditorProps {
  topicId: string
  noteId: string
}

// Mock data
const mockNote = {
  id: "note-1",
  title: "Algebra liniowa",
  content:
    "# Algebra liniowa\n\nAlgebra liniowa to dział matematyki zajmujący się badaniem przestrzeni liniowych oraz przekształceń liniowych.\n\n## Macierze\n\nMacierz to prostokątna tablica liczb, symboli lub wyrażeń, uporządkowana w wiersze i kolumny.\n\n## Wektory\n\nWektor to obiekt matematyczny, który ma zarówno wielkość, jak i kierunek.",
  topicId: "topic-1",
  topicTitle: "Matematyka",
  createdAt: "2023-05-10T10:00:00Z",
  updatedAt: "2023-05-10T10:00:00Z",
}

// Mock adjacent notes
const mockAdjacentNotes = {
  previous: { id: "note-prev", title: "Poprzednia notatka" },
  next: { id: "note-next", title: "Następna notatka" },
}

export default function NoteEditor({ topicId, noteId }: NoteEditorProps) {
  const router = useRouter()
  const [note, setNote] = useState(mockNote)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [adjacentNotes] = useState(mockAdjacentNotes)

  useEffect(() => {
    // In a real app, fetch note data here
    setTitle(mockNote.title)
    setContent(mockNote.content)
  }, [noteId])

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
    try {
      // In a real app, save note data here
      await new Promise((resolve) => setTimeout(resolve, 500))
      setHasUnsavedChanges(false)
      alert("Notatka zapisana pomyślnie")
    } catch (error) {
      alert("Błąd podczas zapisywania notatki")
    }
  }

  const navigateToPreviousNote = () => {
    if (hasUnsavedChanges) {
      if (confirm("Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę?")) {
        router.push(`/topics/${topicId}/notes/${adjacentNotes.previous.id}`)
      }
    } else {
      router.push(`/topics/${topicId}/notes/${adjacentNotes.previous.id}`)
    }
  }

  const navigateToNextNote = () => {
    if (hasUnsavedChanges) {
      if (confirm("Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę?")) {
        router.push(`/topics/${topicId}/notes/${adjacentNotes.next.id}`)
      }
    } else {
      router.push(`/topics/${topicId}/notes/${adjacentNotes.next.id}`)
    }
  }

  const handleNavigateToTopic = () => {
    if (hasUnsavedChanges) {
      if (confirm("Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę?")) {
        router.push(`/topics/${topicId}`)
      }
    } else {
      router.push(`/topics/${topicId}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-neon-yellow glow-text hover:underline cursor-pointer"
                onClick={handleNavigateToTopic}
              >
                <span>{note.topicTitle}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-neon-blue glow-text">{title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={navigateToPreviousNote}
            disabled={!adjacentNotes.previous}
            className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Poprzednia notatka</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={navigateToNextNote}
            disabled={!adjacentNotes.next}
            className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Następna notatka</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90"
          >
            <Save className="mr-2 h-4 w-4" />
            Zapisz
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Tytuł notatki"
          className="text-lg font-medium border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
        />

        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Treść notatki (format Markdown)"
          className="min-h-[60vh] font-mono border-neon-blue/30 bg-black/30 focus-visible:ring-neon-blue/50"
          rows={20}
        />
      </div>
    </div>
  )
}
