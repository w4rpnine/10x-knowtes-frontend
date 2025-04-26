import { notFound } from "next/navigation"
import NoteEditor from "@/components/note-editor"

interface NotePageProps {
  params: Promise<{
    topicId: string
    noteId: string
  }>
}

export default async function NotePage({ params }: NotePageProps) {
  // In a real app, you would fetch the note data here
  // For this example, we'll use mock data

  // Await params before accessing properties
  const { topicId, noteId } = await params;

  // Mock check if note exists
  const noteExists = true

  if (!noteExists) {
    notFound()
  }

  return <NoteEditor topicId={topicId} noteId={noteId} />
}
