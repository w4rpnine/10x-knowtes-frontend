"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, FileText, Plus, FileDown, ChevronRight, ChevronDown, RefreshCw } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getApiBaseUrl } from "@/lib/config"

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

// Type for the create topic response
interface CreateTopicResponse {
  id: string
  title: string
  user_id: string
  created_at: string
  updated_at: string
  notes: Note[]
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Replace the fetchTopics function with real API call
  const fetchTopics = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/topics`, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch topics")
      }
      const data: TopicsResponse = await response.json()

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
      // Only do this on the initial load, not on refresh to preserve expanded state
      if (Object.keys(expandedTopics).length === 0) {
        const expandedState: Record<string, boolean> = {}
        processedTopics.forEach((topic) => {
          expandedState[topic.id] = true // Default to expanded
        })
        setExpandedTopics(expandedState)
      }

      return true
    } catch (error) {
      console.error("Failed to fetch topics:", error)
      toast({
        title: t("navigation.fetchError"),
        description: t("navigation.fetchErrorDesc"),
        variant: "destructive",
      })
      return false
    }
  }

  // Initial data loading
  useEffect(() => {
    async function initialLoad() {
      setIsLoading(true)
      await fetchTopics()
      setIsLoading(false)
    }

    initialLoad()
  }, [toast, t])

  // Listen for refresh tree event
  useEffect(() => {
    const handleRefreshTree = () => {
      fetchTopics()
    }

    // Add event listener
    window.addEventListener("refreshTreePanel", handleRefreshTree)

    // Clean up
    return () => {
      window.removeEventListener("refreshTreePanel", handleRefreshTree)
    }
  }, [])

  // Auto-expand topics based on current path
  useEffect(() => {
    if (pathname && topics.length > 0) {
      // Extract topicId from the pathname
      const match = pathname.match(/\/topics\/([^/]+)/)
      if (match && match[1]) {
        const topicId = match[1]
        // Ensure the topic is expanded
        setExpandedTopics((prev) => ({
          ...prev,
          [topicId]: true,
        }))
      }
    }
  }, [pathname, topics])

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    const success = await fetchTopics()
    setIsRefreshing(false)

    if (success) {
      toast({
        title: t("navigation.refreshSuccess"),
        description: t("navigation.refreshSuccessDesc"),
      })
    }
  }

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

  // Helper function to check if a topic is active based on the current pathname
  const isTopicActive = (topicId: string) => {
    return pathname?.startsWith(`/topics/${topicId}`)
  }

  // Helper function to check if a note is active based on the current pathname
  const isNoteActive = (topicId: string, noteId: string) => {
    return pathname === `/topics/${topicId}/notes/${noteId}`
  }

  // Helper function to check if a summary is active based on the current pathname
  const isSummaryActive = (topicId: string, summaryId: string) => {
    return pathname === `/topics/${topicId}/summary/${summaryId}`
  }

  // Replace the handleCreateTopic function with real API call
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
      // Log all cookies before making the request
      console.log("Current cookies:", document.cookie);
      
      // Get stored cookies from localStorage
      const storedCookies = localStorage.getItem("auth-cookies");
      
      // Prepare headers with auth cookies
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };
      
      // Add the Cookie header if we have stored cookies
      if (storedCookies) {
        console.log("Using stored cookies:", storedCookies);
        headers["Cookie"] = storedCookies;
      }
      
      const response = await fetch(`${getApiBaseUrl()}/api/topics`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: newTopicName, access_token: localStorage.getItem("access_token"), refresh_token: localStorage.getItem("refresh_token"), expires_at: localStorage.getItem("expires_at") }),
      })
      
      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create topic")
      }

      const newTopic: CreateTopicResponse = await response.json()

      toast({
        title: t("navigation.topicCreated"),
        description: t("navigation.topicCreatedDesc", { title: newTopicName }),
      })

      // Update the topics list with the new topic
      const newProcessedTopic: ProcessedTopic = {
        id: newTopic.id,
        title: newTopic.title,
        notes: [],
        summaries: [],
      }

      setTopics((prevTopics) => [...prevTopics, newProcessedTopic])

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
        <div className="flex space-x-2 mb-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90">
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isLoading}
                  className="border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
                >
                  <RefreshCw className={cn("h-4 w-4 text-neon-cyan", (isRefreshing || isLoading) && "animate-spin")} />
                  <span className="sr-only">{t("navigation.refresh")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("navigation.refreshTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="text-xs text-muted-foreground px-1">
          {isRefreshing ? t("navigation.refreshing") : t("navigation.topics")}
        </div>
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
                    "flex items-center p-2 rounded-md hover:bg-black/30 cursor-pointer transition-all duration-200",
                    isTopicActive(topic.id)
                      ? "bg-black/60 border-l-2 border-neon-yellow shadow-[0_0_10px_rgba(255,215,0,0.15)] pl-[6px]"
                      : "hover:bg-black/30",
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
                  <span className={cn("font-medium", isTopicActive(topic.id) && "text-neon-yellow glow-text")}>
                    {topic.title}
                  </span>
                </div>

                {expandedTopics[topic.id] && (
                  <div className="ml-7 pl-4 border-l border-muted/30 mt-1 space-y-1">
                    {topic.notes.map((note) => (
                      <Link key={note.id} href={`/topics/${topic.id}/notes/${note.id}`}>
                        <div
                          className={cn(
                            "flex items-center p-2 rounded-md hover:bg-black/30 transition-colors",
                            isNoteActive(topic.id, note.id) &&
                              "bg-black/40 border-l-2 border-neon-blue shadow-[0_0_8px_rgba(0,128,255,0.15)] pl-[6px]",
                          )}
                        >
                          <FileText className="mr-2 h-4 w-4 note-icon" />
                          <span className={cn(isNoteActive(topic.id, note.id) && "text-neon-blue")}>{note.title}</span>
                        </div>
                      </Link>
                    ))}

                    {topic.summaries.map((summary) => (
                      <Link key={summary.id} href={`/topics/${topic.id}/summary/${summary.id}`}>
                        <div
                          className={cn(
                            "flex items-center p-2 rounded-md hover:bg-black/30 transition-colors",
                            isSummaryActive(topic.id, summary.id) &&
                              "bg-black/40 border-l-2 border-neon-purple shadow-[0_0_8px_rgba(128,0,255,0.15)] pl-[6px]",
                          )}
                        >
                          <FileDown className="mr-2 h-4 w-4 summary-icon" />
                          <span
                            className={cn("text-neon-purple", isSummaryActive(topic.id, summary.id) && "glow-text")}
                          >
                            {summary.title}
                          </span>
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
