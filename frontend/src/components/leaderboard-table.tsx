import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Github, Linkedin, Medal, Minus } from "lucide-react"
import Link from "next/link"

// Mock data for leaderboard
const leaderboardData = [
  {
    id: "1",
    rank: 1,
    previousRank: 1,
    name: "Aarav Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2021",
    points: 2450,
    solved: 78,
    badges: 12,
    github: "aaravpatel",
    linkedin: "aaravpatel",
  },
  {
    id: "2",
    rank: 2,
    previousRank: 3,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2022",
    points: 2320,
    solved: 72,
    badges: 10,
    github: "priyasharma",
    linkedin: "priyasharma",
  },
  {
    id: "3",
    rank: 3,
    previousRank: 2,
    name: "Rahul Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2021",
    points: 2180,
    solved: 65,
    badges: 9,
    github: "rahulsingh",
    linkedin: "rahulsingh",
  },
  {
    id: "4",
    rank: 4,
    previousRank: 4,
    name: "Neha Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2022",
    points: 2050,
    solved: 61,
    badges: 8,
    github: "nehagupta",
    linkedin: "nehagupta",
  },
  {
    id: "5",
    rank: 5,
    previousRank: 7,
    name: "Vikram Joshi",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2023",
    points: 1980,
    solved: 58,
    badges: 7,
    github: "vikramjoshi",
    linkedin: "vikramjoshi",
  },
  {
    id: "6",
    rank: 6,
    previousRank: 5,
    name: "Ananya Desai",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2021",
    points: 1920,
    solved: 55,
    badges: 7,
    github: "ananyad",
    linkedin: "ananyad",
  },
  {
    id: "7",
    rank: 7,
    previousRank: 6,
    name: "Arjun Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2022",
    points: 1850,
    solved: 52,
    badges: 6,
    github: "arjunkumar",
    linkedin: "arjunkumar",
  },
  {
    id: "8",
    rank: 8,
    previousRank: 9,
    name: "Kavya Reddy",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2023",
    points: 1780,
    solved: 50,
    badges: 6,
    github: "kavyareddy",
    linkedin: "kavyareddy",
  },
  {
    id: "9",
    rank: 9,
    previousRank: 8,
    name: "Rohan Mehta",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2021",
    points: 1720,
    solved: 48,
    badges: 5,
    github: "rohanmehta",
    linkedin: "rohanmehta",
  },
  {
    id: "10",
    rank: 10,
    previousRank: 10,
    name: "Ishaan Verma",
    avatar: "/placeholder.svg?height=40&width=40",
    batch: "2022",
    points: 1650,
    solved: 45,
    badges: 5,
    github: "ishaanverma",
    linkedin: "ishaanverma",
  },
]

export function LeaderboardTable({ period = "overall" }: { period?: "overall" | "monthly" | "weekly" }) {
  // Highlight the current user (for demo purposes, let's say the user is rank 12)
  const currentUserId = "12"

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Student</TableHead>
            <TableHead className="hidden md:table-cell">Batch</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="hidden md:table-cell text-right">Solved</TableHead>
            <TableHead className="hidden md:table-cell text-right">Badges</TableHead>
            <TableHead className="hidden md:table-cell text-right">Links</TableHead>
            <TableHead className="w-[100px] text-right">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((student) => (
            <TableRow key={student.id} className={student.id === currentUserId ? "bg-primary/5" : ""}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  {student.rank <= 3 && (
                    <Medal
                      className={`w-4 h-4 ${
                        student.rank === 1 ? "text-yellow-500" : student.rank === 2 ? "text-gray-400" : "text-amber-700"
                      }`}
                    />
                  )}
                  <span>{student.rank}</span>
                  <RankChange current={student.rank} previous={student.previousRank} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline">{student.batch}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">{student.points}</TableCell>
              <TableCell className="hidden md:table-cell text-right">{student.solved}</TableCell>
              <TableCell className="hidden md:table-cell text-right">{student.badges}</TableCell>
              <TableCell className="hidden md:table-cell text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`https://github.com/${student.github}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Github className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`https://linkedin.com/in/${student.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/profile/${student.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RankChange({ current, previous }: { current: number; previous: number }) {
  if (current === previous) {
    return <Minus className="w-3 h-3 text-muted-foreground" />
  }

  if (current < previous) {
    return <ArrowUp className="w-3 h-3 text-green-500" />
  }

  return <ArrowDown className="w-3 h-3 text-red-500" />
}
