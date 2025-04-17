import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderPlus, FileDown } from "lucide-react"

export default function WelcomeContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Witaj w 10x-knowtes
        </h1>
        <p className="text-muted-foreground">
          Twórz, organizuj i generuj podsumowania notatek za pomocą sztucznej inteligencji.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="fancy-card border-neon-yellow/20 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neon-yellow glow-text">Twórz tematy</CardTitle>
            <FolderPlus className="h-4 w-4 topic-icon" />
          </CardHeader>
          <CardContent>
            <CardDescription>Organizuj swoje notatki w tematyczne foldery, aby łatwo je odnaleźć.</CardDescription>
          </CardContent>
        </Card>

        <Card className="fancy-card border-neon-blue/20 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neon-blue glow-text">Dodawaj notatki</CardTitle>
            <FileText className="h-4 w-4 note-icon" />
          </CardHeader>
          <CardContent>
            <CardDescription>
              Twórz notatki w formacie markdown z pełnym wsparciem dla formatowania tekstu.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="fancy-card border-neon-purple/20 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neon-purple glow-text">Generuj podsumowania</CardTitle>
            <FileDown className="h-4 w-4 summary-icon" />
          </CardHeader>
          <CardContent>
            <CardDescription>Wykorzystaj AI do automatycznego generowania podsumowań całych tematów.</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="fancy-card bg-gradient-to-br from-black/80 to-black/40 border-neon-cyan/20">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
            Rozpocznij pracę
          </CardTitle>
          <CardDescription>
            Wybierz temat z lewego panelu lub utwórz nowy, aby rozpocząć pracę z notatkami.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Kliknij prawym przyciskiem myszy na temacie, aby zobaczyć dostępne opcje, takie jak dodawanie notatek czy
            generowanie podsumowań.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
