import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Medal } from "lucide-react"
import Link from "next/link"

// Mock data for top performers
const topThree = [
  {
    id: "1",
    rank: 1,
    name: "Aarav Patel",
    avatar: "/placeholder.svg?height=80&width=80",
    batch: "2021",
    points: 2450,
    solved: 78,
    github: "aaravpatel",
    linkedin: "aaravpatel",
  },
  {
    id: "2",
    rank: 2,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=80&width=80",
    batch: "2022",
    points: 2320,
    solved: 72,
    github: "priyasharma",
    linkedin: "priyasharma",
  },
  {
    id: "3",
    rank: 3,
    name: "Rahul Singh",
    avatar: "/placeholder.svg?height=80&width=80",
    batch: "2021",
    points: 2180,
    solved: 65,
    github: "rahulsingh",
    linkedin: "rahulsingh",
  },
]

export function TopPerformers() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {topThree.map((performer, index) => (
        <Card
          key={performer.id}
          className={`overflow-hidden ${index === 0 ? "border-yellow-500" : index === 1 ? "border-gray-400" : "border-amber-700"}`}
        >
          <div className={`h-2 ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"}`} />
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-background">
                  <AvatarImage src={performer.avatar || "/placeholder.svg"} alt={performer.name} />
                  <AvatarFallback>{performer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                  }`}
                >
                  <Medal className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-bold">{performer.name}</h3>
              <p className="text-sm text-muted-foreground">Batch {performer.batch}</p>

              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="p-2 text-center rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Points</p>
                  <p className="text-lg font-bold">{performer.points}</p>
                </div>
                <div className="p-2 text-center rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Solved</p>
                  <p className="text-lg font-bold">{performer.solved}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4">
                <Link href={`https://github.com/${performer.github}`} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href={`https://linkedin.com/in/${performer.linkedin}`} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
