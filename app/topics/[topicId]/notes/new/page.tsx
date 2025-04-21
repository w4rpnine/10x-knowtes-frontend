import { notFound } from "next/navigation"
import NewNoteEditor from "@/components/new-note-editor"

interface NewNotePageProps {
  params: {
    topicId: string
  }
}

export default function NewNotePage({ params }: NewNotePageProps) {
  // In a real app, you would check if the topic exists
  // For this example, we'll use mock data

  // Mock check if topic exists
  const topicExists = true

  if (!topicExists) {
    notFound()
  }

  return <NewNoteEditor topicId={params.topicId} />
}
