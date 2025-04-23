"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface SummaryPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summaryUuid: string
  initialTitle: string
  initialContent: string
  topicId: string
}

export default function SummaryPreviewModal({
  open,
  onOpenChange,
  summaryUuid,
  initialTitle,
  initialContent,
  topicId,
}: SummaryPreviewModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`http://localhost:3001/api/topics/${topicId}/summaries/${summaryUuid}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        throw new Error("Failed to accept summary")
      }

      const data = await response.json()

      // Dispatch event to refresh the tree panel
      const refreshTreeEvent = new Event("refreshTreePanel")
      window.dispatchEvent(refreshTreeEvent)

      toast({
        title: t("summary.summaryAccepted"),
        description: t("summary.summaryAcceptedDesc"),
      })

      // Close the modal
      onOpenChange(false)

      // Navigate to the summary view with the note ID from the response
      router.push(`/topics/${topicId}/summary/${data.noteId}`)
    } catch (error) {
      console.error("Failed to accept summary:", error)
      toast({
        title: t("summary.error"),
        description: t("summary.acceptError"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`http://localhost:3001/api/topics/${topicId}/summaries/${summaryUuid}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject summary")
      }

      toast({
        title: t("summary.summaryRejected"),
        description: t("summary.summaryRejectedDesc"),
      })

      // Close the modal
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to reject summary:", error)
      toast({
        title: t("summary.error"),
        description: t("summary.rejectError"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to handle outside clicks - prevent closing
  const handleOutsideClick = (event: React.MouseEvent) => {
    event.preventDefault()
    // Show a toast to inform the user they need to use the buttons
    toast({
      title: t("summary.cannotDismiss"),
      description: t("summary.useButtonsToClose"),
      variant: "destructive",
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Only allow closing the dialog if it's being opened or if isProcessing is false
        if (newOpen || !isProcessing) {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[800px] max-h-[90vh] bg-black/80 border-neon-purple/30 backdrop-blur-sm overflow-y-auto"
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside
          e.preventDefault()
          // Show a toast to inform the user
          toast({
            title: t("summary.cannotDismiss"),
            description: t("summary.useButtonsToClose"),
          })
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing when pressing Escape
          e.preventDefault()
          // Show a toast to inform the user
          toast({
            title: t("summary.cannotDismiss"),
            description: t("summary.useButtonsToClose"),
          })
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-neon-purple glow-text">{t("summary.previewTitle")}</DialogTitle>
          <DialogDescription>{t("summary.previewDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="summary-title" className="text-sm font-medium">
              {t("summary.titleLabel")}
            </label>
            <Input
              id="summary-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary-content" className="text-sm font-medium">
              {t("summary.contentLabel")}
            </label>
            <Textarea
              id="summary-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[40vh] font-mono border-neon-purple/30 bg-black/30 focus-visible:ring-neon-purple/50"
              rows={15}
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            onClick={handleReject}
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
            disabled={isProcessing}
          >
            {isProcessing ? t("summary.processing") : t("summary.reject")}
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90"
            disabled={isProcessing}
          >
            {isProcessing ? t("summary.processing") : t("summary.accept")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
