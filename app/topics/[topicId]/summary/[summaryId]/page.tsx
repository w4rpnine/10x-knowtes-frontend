import { notFound } from "next/navigation"
import SummaryView from "@/components/summary-view"

interface SummaryPageProps {
  params: Promise<{
    topicId: string
    summaryId: string
  }>
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  // In a real app, you would fetch the summary data here
  // For this example, we'll use mock data

  // Await params before accessing properties
  const { topicId, summaryId } = await params;

  // Mock check if summary exists
  const summaryExists = true

  if (!summaryExists) {
    notFound()
  }

  return <SummaryView topicId={topicId} summaryId={summaryId} />
}
