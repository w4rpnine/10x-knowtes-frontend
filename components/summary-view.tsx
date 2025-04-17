"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Check, X, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SummaryViewProps {
  topicId: string
  summaryId: string
}

// Mock data
const mockSummary = {
  id: "summary-1",
  title: "Podsumowanie matematyki",
  content:
    "# Podsumowanie matematyki\n\n## Algebra liniowa\nAlgebra liniowa to dział matematyki zajmujący się badaniem przestrzeni liniowych oraz przekształceń liniowych. Kluczowe pojęcia to macierze i wektory.\n\n## Rachunek różniczkowy\nRachunek różniczkowy to dział analizy matematycznej zajmujący się badaniem zmian funkcji. Główne pojęcia to pochodna i całka.",
  topicId: "topic-1",
  topicTitle: "Matematyka",
  createdAt: "2023-05-15T09:15:00Z",
  status: "pending", // pending, accepted, rejected
}

export default function SummaryView({ topicId, summaryId }: SummaryViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [summary] = useState(mockSummary)

  const handleAccept = async () => {
    try {
      // In a real app, save acceptance status here
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Podsumowanie zaakceptowane",
        description: "Podsumowanie zostało zapisane w twoich notatkach.",
      })
      router.push(`/topics/${topicId}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaakceptować podsumowania.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    try {
      // In a real app, save rejection status here
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Podsumowanie odrzucone",
        description: "Podsumowanie zostało odrzucone.",
      })
      router.push(`/topics/${topicId}`)
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się odrzucić podsumowania.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.content)
    toast({
      title: "Skopiowano",
      description: "Treść podsumowania została skopiowana do schowka.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-neon-yellow glow-text hover:underline cursor-pointer">
                <Link href={`/topics/${topicId}`}>{summary.topicTitle}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-neon-purple glow-text">{summary.title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Kopiuj</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <X className="mr-2 h-4 w-4" />
            Odrzuć
          </Button>
          <Button onClick={handleAccept} className="bg-gradient-to-r from-neon-green to-neon-cyan hover:opacity-90">
            <Check className="mr-2 h-4 w-4" />
            Zapisz
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={summary.content}
          readOnly
          className="min-h-[60vh] font-mono bg-black/40 border-neon-purple/30 text-neon-purple/90"
          rows={20}
        />
      </div>
    </div>
  )
}
