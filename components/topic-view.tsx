"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { FileText, FileDown, Plus } from "lucide-react"

interface TopicViewProps {
  topicId: string
}

// Mock data
const mockTopic = {
  id: "topic-1",
  title: "Matematyka",
  notes: [
    { id: "note-1", title: "Algebra liniowa", createdAt: "2023-05-10T10:00:00Z" },
    { id: "note-2", title: "Rachunek różniczkowy", createdAt: "2023-05-12T14:30:00Z" },
  ],
  summaries: [{ id: "summary-1", title: "Podsumowanie matematyki", createdAt: "2023-05-15T09:15:00Z" }],
}

export default function TopicView({ topicId }: TopicViewProps) {
  const [topic] = useState(mockTopic)

  const handleCreateNote = () => {
    alert("Tworzenie nowej notatki")
  }

  const handleGenerateSummary = () => {
    alert("Generowanie podsumowania")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-neon-yellow glow-text font-medium">{topic.title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex space-x-2">
          <Button onClick={handleCreateNote} className="bg-gradient-to-r from-neon-blue to-neon-cyan hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Nowa notatka
          </Button>
          <Button
            onClick={handleGenerateSummary}
            variant="outline"
            className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Generuj podsumowanie
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {topic.notes.map((note) => (
          <Link key={note.id} href={`/topics/${topicId}/notes/${note.id}`}>
            <Card className="fancy-card hover:bg-black/40 transition-colors border-neon-blue/20 bg-black/30">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4 note-icon" />
                    <span className="text-neon-blue">{note.title}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {topic.summaries.map((summary) => (
          <Link key={summary.id} href={`/topics/${topicId}/summary/${summary.id}`}>
            <Card className="fancy-card hover:bg-black/40 transition-colors border-neon-purple/30 bg-black/30">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <FileDown className="mr-2 h-4 w-4 summary-icon" />
                    <span className="text-neon-purple glow-text">{summary.title}</span>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {topic.notes.length === 0 && topic.summaries.length === 0 && (
          <Card className="fancy-card bg-black/30">
            <CardContent className="p-6 text-center text-muted-foreground">
              Ten temat nie zawiera jeszcze żadnych notatek ani podsumowań. Kliknij "Nowa notatka", aby dodać pierwszą
              notatkę.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
