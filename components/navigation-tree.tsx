"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, FileText, Plus, FileDown, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const { toast } = useToast()
  const { t } = useTranslation()
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    "topic-1": true,
    "topic-2": true,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTopicName, setNewTopicName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [topics, setTopics] = useState(mockTopics)

  useEffect(() => {
    // BACKEND INTEGRATION: Load topics, notes, and summaries for the navigation tree
    // This should fetch all topics with their notes and summaries for the current user
    // Example API call:
    // async function fetchTopics() {
    //   try {
    //     const response = await fetch('/api/topics');
    //     const data = await response.json();
    //     setTopics(data);
    //
    //     // Initialize expanded state for all topics
    //     const expandedState: Record<string, boolean> = {};
    //     data.forEach((topic: any) => {
    //       expandedState[topic.id] = true; // Default to expanded
    //     });
    //     setExpandedTopics(expandedState);
    //   } catch (error) {
    //     console.error('Failed to fetch topics:', error);
    //     toast({
    //       title: "Błąd",
    //       description: "Nie udało się załadować tematów",
    //       variant: "destructive",
    //     });
    //   }
    // }
    //
    // fetchTopics();
  }, [toast])

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

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTopicName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa tematu nie może być pusta",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // BACKEND INTEGRATION: Create a new topic
      // This should send a POST request to create a new topic with the given name
      // Example API call:
      // const response = await fetch('/api/topics', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ title: newTopicName }),
      // });
      //
      // if (!response.ok) throw new Error('Failed to create topic');
      // const newTopic = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call

      // Generate a mock ID for the new topic
      const newTopicId = `topic-${Date.now()}`

      toast({
        title: "Temat utworzony",
        description: `Temat "${newTopicName}" został pomyślnie utworzony`,
      })

      // BACKEND INTEGRATION: Reload the navigation tree after creating a topic
      // This should fetch the updated list of topics
      // Example:
      // fetchTopics();

      // Reset form and close dialog
      setNewTopicName("")
      setIsDialogOpen(false)

      // Navigate to the new topic
      router.push(`/topics/${newTopicId}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się utworzyć tematu",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-black/30">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              {t("navigation.newTopic")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/80 border-neon-purple/30 backdrop-blur-sm">
            <form onSubmit={handleCreateTopic}>
              <DialogHeader>
                <DialogTitle className="text-neon-purple glow-text">{t("navigation.createTopic")}</DialogTitle>
                <DialogDescription>{t("navigation.createTopicDesc")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topic-name" className="text-right">
                    {t("navigation.topicName")}
                  </Label>
                  <Input
                    id="topic-name"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="col-span-3 border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
                    placeholder={t("navigation.topicNamePlaceholder")}
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-muted-foreground text-muted-foreground hover:bg-muted/10"
                  disabled={isCreating}
                >
                  {t("navigation.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90"
                  disabled={isCreating}
                >
                  {isCreating ? t("navigation.creating") : t("navigation.create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {topics.map((topic) => (
            <div key={topic.id} className="mb-4">
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
                  aria-label={expandedTopics[topic.id] ? "Collapse topic" : "Expand topic"}
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

              {expandedTopics[topic.id] && (
                <div className="ml-7 pl-4 border-l border-muted/30 mt-1 space-y-1">
                  {topic.notes.map((note) => (
                    <Link key={note.id} href={`/topics/${topic.id}/notes/${note.id}`}>
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
