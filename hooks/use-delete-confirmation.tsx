"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmationOptions {
  title: string
  description: string
  onConfirm: () => void
}

interface DeleteConfirmationContextType {
  showDeleteConfirmation: (options: DeleteConfirmationOptions) => void
}

const DeleteConfirmationContext = createContext<DeleteConfirmationContextType | undefined>(undefined)

export function DeleteConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<DeleteConfirmationOptions>({
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const showDeleteConfirmation = (options: DeleteConfirmationOptions) => {
    setOptions(options)
    setOpen(true)
  }

  const handleConfirm = () => {
    options.onConfirm()
    setOpen(false)
  }

  return (
    <DeleteConfirmationContext.Provider value={{ showDeleteConfirmation }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Potwierdź
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteConfirmationContext.Provider>
  )
}

export function useDeleteConfirmation() {
  const context = useContext(DeleteConfirmationContext)
  if (context === undefined) {
    throw new Error("useDeleteConfirmation must be used within a DeleteConfirmationProvider")
  }
  return context
}
