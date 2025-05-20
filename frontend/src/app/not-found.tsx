import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-muted/30">
      <div className="flex items-center mb-8">
        <Code className="w-8 h-8 mr-2 text-primary" />
        <span className="text-2xl font-bold">
          Khwopa<span className="text-primary">Coder</span>
        </span>
      </div>
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
      <p className="max-w-md mb-8 text-center text-muted-foreground">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
