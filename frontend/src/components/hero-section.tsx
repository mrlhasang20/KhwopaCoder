import { Button } from "@/components/ui/button"
import { ArrowRight, Code } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-grid-small-black/[0.2] bg-[length:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/20" />

      <div className="container relative px-4 py-20 mx-auto text-center md:py-32">
        <Code className="w-16 h-16 p-3 mx-auto mb-6 rounded-xl bg-primary/10 text-primary" />
        <h1 className="max-w-3xl mx-auto mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Showcase Your <span className="text-primary">Coding Skills</span>
        </h1>
        <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground md:text-xl">
          Compete with fellow students, solve challenging problems, and climb the leaderboard at Khwopa Engineering
          College.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/login">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">View Leaderboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
