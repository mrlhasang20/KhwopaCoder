"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
}

export function CodeEditor({ value, onChange, language = "javascript", readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<any>(null)
  const { toast } = useToast()

  // Load Monaco editor
  useEffect(() => {
    if (typeof window !== "undefined" && !editor && editorRef.current) {
      // This would normally load Monaco editor
      // For this demo, we'll use a simple textarea with syntax highlighting simulation
      const textArea = document.createElement("textarea")
      textArea.value = value
      textArea.className = "w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
      textArea.readOnly = readOnly

      if (!readOnly) {
        textArea.addEventListener("input", (e) => {
          const target = e.target as HTMLTextAreaElement
          onChange(target.value)
        })

        // Anti-cheat: Prevent copy-paste
        textArea.addEventListener("copy", (e) => {
          if (!readOnly) {
            e.preventDefault()
            toast({
              title: "Copy detected",
              description: "Copying code is not allowed during challenges",
              variant: "destructive",
            })
          }
        })

        textArea.addEventListener("paste", (e) => {
          if (!readOnly) {
            e.preventDefault()
            toast({
              title: "Paste detected",
              description: "Pasting code is not allowed during challenges",
              variant: "destructive",
            })
          }
        })

        // Anti-cheat: Detect when user leaves the editor
        textArea.addEventListener("blur", () => {
          if (!readOnly) {
            toast({
              title: "Focus lost",
              description: "Leaving the code editor during a challenge is recorded",
              variant: "warning",
            })
          }
        })
      }

      // Clear previous content
      if (editorRef.current) {
        editorRef.current.innerHTML = ""
        editorRef.current.appendChild(textArea)
        setEditor(textArea)
      }
    }

    return () => {
      // Cleanup
    }
  }, [editor, onChange, readOnly, toast, value])

  // Update editor value when prop changes
  useEffect(() => {
    if (editor && editor.value !== value) {
      editor.value = value
    }
  }, [editor, value])

  return <div ref={editorRef} className="w-full h-full border-0 bg-muted/50" data-language={language} />
}
