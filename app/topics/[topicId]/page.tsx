import { notFound } from "next/navigation"
import TopicView from "@/components/topic-view"

interface TopicPageProps {
  params: Promise<{
    topicId: string
  }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  // In a real app, you would fetch the topic data here
  // For this example, we'll use mock data

  // Await params before accessing properties
  const { topicId } = await params;

  // Mock check if topic exists
  const topicExists = true

  if (!topicExists) {
    notFound()
  }

  return <TopicView topicId={topicId} />
}
