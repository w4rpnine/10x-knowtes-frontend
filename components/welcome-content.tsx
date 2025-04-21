import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderPlus, FileDown } from "lucide-react"

export default function WelcomeContent() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          {t("dashboard.welcome.title")}
        </h1>
        <p className="text-muted-foreground">{t("dashboard.welcome.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="fancy-card border-neon-yellow/20 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neon-yellow glow-text">
              {t("dashboard.welcome.createTopics")}
            </CardTitle>
            <FolderPlus className="h-4 w-4 topic-icon" />
          </CardHeader>
          <CardContent>
            <CardDescription>{t("dashboard.welcome.createTopicsDesc")}</CardDescription>
          </CardContent>
        </Card>

        <Card className="fancy-card border-neon-blue/20 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neon-blue glow-text">
              {t("dashboard.welcome.addNotes")}
            </CardTitle>
            <FileText className="h-4 w-4 note-icon" />
          </CardHeader>
          <CardContent>
            <CardDescription>{t("dashboard.welcome.addNotesDesc")}</CardDescription>
          </CardContent>
        </Card>

        <Card className="fancy-card border-neon-purple/20 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neon-purple glow-text">
              {t("dashboard.welcome.generateSummaries")}
            </CardTitle>
            <FileDown className="h-4 w-4 summary-icon" />
          </CardHeader>
          <CardContent>
            <CardDescription>{t("dashboard.welcome.generateSummariesDesc")}</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="fancy-card bg-gradient-to-br from-black/80 to-black/40 border-neon-cyan/20">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
            {t("dashboard.welcome.getStarted")}
          </CardTitle>
          <CardDescription>{t("dashboard.welcome.getStartedDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("dashboard.welcome.rightClickTip")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
