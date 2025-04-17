"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Folder, FileText, Plus, Edit, Trash2, FileDown, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"

// Mock data structure
const mockTopics = [
  {
    id: "topic-1",
    title: "Matematyka",
    notes: [
      { id: "note-1", title: "Algebra liniowa" },
      { id: "note-2", title: "Rachunek różniczkowy" },
    ],
    summaries: [{ id: "summary-1", title: "Podsumowanie matematyki" }],
  },
  {
    id: "topic-2",
    title: "Fizyka",
    notes: [
      { id: "note-3", title: "Mechanika kwantowa" },
      { id: "note-4", title: "Termodynamika" },
    ],
    summaries: [],
  },
]

export default function NavigationTree() {
  const pathname = usePathname()
  const router = useRouter()
  const { showDeleteConfirmation } = useDeleteConfirmation()
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    "topic-1": true,
    "topic-2": true,
  })

  const toggleTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking the toggle button
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }))
  }

  const navigateToTopic = (topicId: string) => {
    router.push(`/topics/${topicId}`)
  }

  const handleCreateTopic = () => {
    // Implementation for creating a new topic
    alert("Funkcja tworzenia nowego tematu")
  }

  const handleCreateNote = (topicId: string) => {
    // Implementation for creating a new note
    alert(`Tworzenie nowej notatki w temacie ${topicId}`)
  }

  const handleGenerateSummary = (topicId: string) => {
    // Implementation for generating a summary
    alert(`Generowanie podsumowania dla tematu ${topicId}`)
  }

  const handleDeleteTopic = (topicId: string, topicTitle: string) => {
    showDeleteConfirmation({
      title: "Usuń temat",
      description: `Czy na pewno chcesz usunąć temat "${topicTitle}" wraz ze wszystkimi notatkami?`,
      onConfirm: () => {
        // Implementation for deleting a topic
        alert(`Usunięto temat ${topicId}`)
      },
    })
  }

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    showDeleteConfirmation({
      title: "Usuń notatkę",
      description: `Czy na pewno chcesz usunąć notatkę "${noteTitle}"?`,
      onConfirm: () => {
        // Implementation for deleting a note
        alert(`Usunięto notatkę ${noteId}`)
      },
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-black/30">
        <Button
          onClick={handleCreateTopic}
          className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nowy temat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockTopics.map((topic) => (
            <div key={topic.id} className="mb-4">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-black/30 cursor-pointer",
                      pathname === `/topics/${topic.id}` && "bg-black/40",
                    )}
                    onClick={() => navigateToTopic(topic.id)}
                  >
                    <button
                      onClick={(e) => toggleTopic(topic.id, e)}
                      className="mr-1 p-1 rounded-full hover:bg-black/20 focus:outline-none"
                      aria-label={expandedTopics[topic.id] ? "Zwiń temat" : "Rozwiń temat"}
                    >
                      {expandedTopics[topic.id] ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                    <Folder className="mr-2 h-4 w-4 topic-icon" />
                    <span className="font-medium">{topic.title}</span>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleCreateNote(topic.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nowa notatka
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleGenerateSummary(topic.id)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Generuj podsumowanie
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Zmień nazwę
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteTopic(topic.id, topic.title)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Usuń temat
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {expandedTopics[topic.id] && (
                <div className="ml-7 pl-4 border-l border-muted/30 mt-1 space-y-1">
                  {topic.notes.map((note) => (
                    <ContextMenu key={note.id}>
                      <ContextMenuTrigger>
                        <Link href={`/topics/${topic.id}/notes/${note.id}`}>
                          <div
                            className={cn(
                              "flex items-center p-2 rounded-md hover:bg-black/30",
                              pathname === `/topics/${topic.id}/notes/${note.id}` && "bg-black/40",
                            )}
                          >
                            <FileText className="mr-2 h-4 w-4 note-icon" />
                            <span>{note.title}</span>
                          </div>
                        </Link>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Zmień nazwę
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteNote(note.id, note.title)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Usuń notatkę
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}

                  {topic.summaries.map((summary) => (
                    <Link key={summary.id} href={`/topics/${topic.id}/summary/${summary.id}`}>
                      <div
                        className={cn(
                          "flex items-center p-2 rounded-md hover:bg-black/30",
                          pathname === `/topics/${topic.id}/summary/${summary.id}` && "bg-black/40",
                        )}
                      >
                        <FileDown className="mr-2 h-4 w-4 summary-icon" />
                        <span className="text-neon-purple glow-text">{summary.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
