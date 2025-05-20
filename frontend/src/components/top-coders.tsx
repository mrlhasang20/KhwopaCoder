import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Medal, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data for top coders
const topCoders = [
  {
    id: "1",
    name: "Aarav Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 1,
    points: 2450,
    solved: 78,
    batch: "2021",
    github: "aaravpatel",
    linkedin: "aaravpatel",
  },
  {
    id: "2",
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 2,
    points: 2320,
    solved: 72,
    batch: "2022",
    github: "priyasharma",
    linkedin: "priyasharma",
  },
  {
    id: "3",
    name: "Rahul Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 3,
    points: 2180,
    solved: 65,
    batch: "2021",
    github: "rahulsingh",
    linkedin: "rahulsingh",
  },
  {
    id: "4",
    name: "Neha Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 4,
    points: 2050,
    solved: 61,
    batch: "2022",
    github: "nehagupta",
    linkedin: "nehagupta",
  },
  {
    id: "5",
    name: "Vikram Joshi",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 5,
    points: 1980,
    solved: 58,
    batch: "2023",
    github: "vikramjoshi",
    linkedin: "vikramjoshi",
  },
  {
    id: "6",
    name: "Ananya Desai",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 6,
    points: 1920,
    solved: 55,
    batch: "2021",
    github: "ananyad",
    linkedin: "ananyad",
  },
]

export function TopCoders() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topCoders.map((coder) => (
          <Card key={coder.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="w-20 h-20 border-4 border-background">
                    <AvatarImage src={coder.avatar || "/placeholder.svg"} alt={coder.name} />
                    <AvatarFallback>{coder.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      coder.rank === 1 ? "bg-yellow-500" : coder.rank === 2 ? "bg-gray-400" : "bg-amber-700"
                    }`}
                  >
                    <Medal className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-bold">{coder.name}</h3>
                <p className="text-sm text-muted-foreground">Batch {coder.batch}</p>

                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <div className="p-2 text-center rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="text-lg font-bold">{coder.points}</p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Solved</p>
                    <p className="text-lg font-bold">{coder.solved}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <Link href={`https://github.com/${coder.github}`} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link href={`https://linkedin.com/in/${coder.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/login">
            View Full Leaderboard <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
