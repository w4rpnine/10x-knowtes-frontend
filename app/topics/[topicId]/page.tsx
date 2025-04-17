import { notFound } from "next/navigation"
import TopicView from "@/components/topic-view"

interface TopicPageProps {
  params: {
    topicId: string
  }
}

export default function TopicPage({ params }: TopicPageProps) {
  // In a real app, you would fetch the topic data here
  // For this example, we'll use mock data

  // Mock check if topic exists
  const topicExists = true

  if (!topicExists) {
    notFound()
  }

  return <TopicView topicId={params.topicId} />
}
