import { notFound } from "next/navigation"
import NoteEditor from "@/components/note-editor"

interface NotePageProps {
  params: {
    topicId: string
    noteId: string
  }
}

export default function NotePage({ params }: NotePageProps) {
  // In a real app, you would fetch the note data here
  // For this example, we'll use mock data

  // Mock check if note exists
  const noteExists = true

  if (!noteExists) {
    notFound()
  }

  return <NoteEditor topicId={params.topicId} noteId={params.noteId} />
}
