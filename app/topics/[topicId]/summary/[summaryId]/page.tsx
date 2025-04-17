import { notFound } from "next/navigation"
import SummaryView from "@/components/summary-view"

interface SummaryPageProps {
  params: {
    topicId: string
    summaryId: string
  }
}

export default function SummaryPage({ params }: SummaryPageProps) {
  // In a real app, you would fetch the summary data here
  // For this example, we'll use mock data

  // Mock check if summary exists
  const summaryExists = true

  if (!summaryExists) {
    notFound()
  }

  return <SummaryView topicId={params.topicId} summaryId={params.summaryId} />
}
