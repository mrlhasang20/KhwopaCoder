"use client"

import { Button } from "@/components/ui/button"
import { Code, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-muted/30">
      <div className="flex items-center mb-8">
        <Code className="w-8 h-8 mr-2 text-primary" />
        <span className="text-2xl font-bold">
          Khwopa<span className="text-primary">Coder</span>
        </span>
      </div>
      <h1 className="mb-4 text-4xl font-bold">Something went wrong!</h1>
      <p className="max-w-md mb-8 text-center text-muted-foreground">
        We apologize for the inconvenience. An error occurred while processing your request.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={reset}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
