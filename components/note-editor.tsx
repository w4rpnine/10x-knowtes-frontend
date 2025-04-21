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

export default function NoteEditor({ topicId, noteId }: NoteEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { showDeleteConfirmation } = useDeleteConfirmation()
  const { t } = useTranslation()
  const [note, setNote] = useState(mockNote)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Store original values for discard functionality
  const originalTitle = useRef("")
  const originalContent = useRef("")

  useEffect(() => {
    // BACKEND INTEGRATION: Load note data
    // This should fetch the note details and the topic title
    // Example API call:
    // async function fetchNote() {
    //   try {
    //     const response = await fetch(`/api/topics/${topicId}/notes/${noteId}`);
    //     const data = await response.json();
    //     setNote(data);
    //     setTitle(data.title);
    //     setContent(data.content);
    //
    //     // Store original values for discard functionality
    //     originalTitle.current = data.title;
    //     originalContent.current = data.content;
    //   } catch (error) {
    //     console.error('Failed to fetch note:', error);
    //     toast({
    //       title: "Błąd",
    //       description: "Nie udało się załadować notatki",
    //       variant: "destructive",
    //     });
    //   }
    // }
    //
    // fetchNote();

    // In a real app, fetch note data here
    setTitle(mockNote.title)
    setContent(mockNote.content)

    // Store original values
    originalTitle.current = mockNote.title
    originalContent.current = mockNote.content
  }, [noteId, topicId, toast])

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
      // BACKEND INTEGRATION: Save note changes
      // This should send a PATCH/PUT request to update the note title and content
      // Example API call:
      // const response = await fetch(`/api/topics/${topicId}/notes/${noteId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: title,
      //     content: content
      //   }),
      // });
      //
      // if (!response.ok) throw new Error('Failed to save note');
      // const updatedNote = await response.json();

      // In a real app, save note data here
      await new Promise((resolve) => setTimeout(resolve, 500))

      // BACKEND INTEGRATION: Reload the navigation tree if title changed
      // If the title changed, we need to refresh the navigation tree
      // Example:
      // if (originalTitle.current !== title) {
      //   eventEmitter.emit('refreshNavigationTree');
      // }

      setHasUnsavedChanges(false)

      // Update original values after successful save
      originalTitle.current = title
      originalContent.current = content

      toast({
        title: t("note.saved"),
        description: t("note.savedDesc"),
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać notatki",
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

  const handleDeleteNote = () => {
    showDeleteConfirmation({
      title: t("note.deleteNote"),
      description: t("note.deleteNoteConfirm", { title }),
      onConfirm: async () => {
        // BACKEND INTEGRATION: Delete note
        // This should send a DELETE request to remove the note
        // Example API call:
        // try {
        //   const response = await fetch(`/api/topics/${topicId}/notes/${noteId}`, {
        //     method: 'DELETE',
        //   });
        //
        //   if (!response.ok) throw new Error('Failed to delete note');
        //
        //   // BACKEND INTEGRATION: Reload the navigation tree after deleting note
        //   // This should trigger a refresh of the navigation tree component
        //   // Example: eventEmitter.emit('refreshNavigationTree');
        //
        //   toast({
        //     title: "Notatka usunięta",
        //     description: "Notatka została pomyślnie usunięta",
        //   });
        //
        //   router.push(`/topics/${topicId}`);
        // } catch (error) {
        //   console.error('Failed to delete note:', error);
        //   toast({
        //     title: "Błąd",
        //     description: "Nie udało się usunąć notatki",
        //     variant: "destructive",
        //   });
        // }

        // Implementation for deleting a note
        toast({
          title: t("note.noteDeleted"),
          description: t("note.noteDeletedDesc"),
        })
        router.push(`/topics/${topicId}`)
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
                  <span>{note.topicTitle}</span>
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
