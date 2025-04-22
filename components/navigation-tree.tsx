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

// Define types based on the API response
interface Note {
  id: string
  title: string
  content: string
  user_id: string
  topic_id: string
  created_at: string
  updated_at: string
  is_summary: boolean
}

interface Topic {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  notes: Note[]
}

interface TopicsResponse {
  data: Topic[]
  count: number
  total: number
}

// Type for our processed topics with separated notes and summaries
interface ProcessedTopic {
  id: string
  title: string
  notes: {
    id: string
    title: string
    created_at: string
  }[]
  summaries: {
    id: string
    title: string
    created_at: string
  }[]
}

export default function NavigationTree() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTopicName, setNewTopicName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [topics, setTopics] = useState<ProcessedTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch topics from the API
    async function fetchTopics() {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:3001/api/topics");
        if (!response.ok) {
           throw new Error("Failed to fetch topics");
        }
        const data: TopicsResponse = await response.json();

        // Process the mock data the same way as the real data
        const processedTopics: ProcessedTopic[] = data.data.map((topic) => {
          // Separate notes and summaries
          const regularNotes = topic.notes.filter((note) => !note.is_summary)
          const summaryNotes = topic.notes.filter((note) => note.is_summary)

          return {
            id: topic.id,
            title: topic.title,
            notes: regularNotes.map((note) => ({
              id: note.id,
              title: note.title,
              created_at: note.created_at,
            })),
            summaries: summaryNotes.map((note) => ({
              id: note.id,
              title: note.title,
              created_at: note.created_at,
            })),
          }
        })

        setTopics(processedTopics)

        // Initialize expanded state for all topics
        const expandedState: Record<string, boolean> = {}
        processedTopics.forEach((topic) => {
          expandedState[topic.id] = true // Default to expanded
        })
        setExpandedTopics(expandedState)
      } catch (error) {
        console.error("Failed to fetch topics:", error)
        toast({
          title: t("navigation.fetchError"),
          description: t("navigation.fetchErrorDesc"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopics()
  }, [toast, t])

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
        title: t("navigation.error"),
        description: t("navigation.topicNameRequired"),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // Comment out the actual API call
      // const response = await fetch("/api/topics", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ title: newTopicName }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error("Failed to create topic");
      // }
      //
      // const newTopic = await response.json();

      // Mock the creation of a new topic
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

      const newTopic = {
        id: `topic-${Date.now()}`,
        user_id: "user-123",
        title: newTopicName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: [],
      }

      toast({
        title: t("navigation.topicCreated"),
        description: t("navigation.topicCreatedDesc", { title: newTopicName }),
      })

      // Update the topics list with the new topic
      setTopics((prevTopics) => [
        ...prevTopics,
        {
          id: newTopic.id,
          title: newTopic.title,
          notes: [],
          summaries: [],
        },
      ])

      // Ensure the new topic is expanded
      setExpandedTopics((prev) => ({
        ...prev,
        [newTopic.id]: true,
      }))

      // Reset form and close dialog
      setNewTopicName("")
      setIsDialogOpen(false)

      // Navigate to the new topic
      router.push(`/topics/${newTopic.id}`)
    } catch (error) {
      console.error("Failed to create topic:", error)
      toast({
        title: t("navigation.error"),
        description: t("navigation.createTopicError"),
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-neon-purple animate-pulse">{t("app.loading")}</div>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("navigation.noTopics")}</p>
              <p className="text-sm mt-2">{t("navigation.createFirstTopic")}</p>
            </div>
          ) : (
            topics.map((topic) => (
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

                    {topic.notes.length === 0 && topic.summaries.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">{t("navigation.noNotes")}</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
