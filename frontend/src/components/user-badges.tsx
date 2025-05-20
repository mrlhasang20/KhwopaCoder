import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Cpu, Database, FileCode2, Flame, GitBranch, Lightbulb, Puzzle, Sigma, Zap } from "lucide-react"

// Mock data for user badges
const badges = [
  {
    id: "1",
    name: "Algorithm Master",
    description: "Completed 5 algorithm challenges",
    icon: Cpu,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    earnedAt: "2 days ago",
  },
  {
    id: "2",
    name: "Data Structure Guru",
    description: "Solved challenges using 5 different data structures",
    icon: Database,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    earnedAt: "1 week ago",
  },
  {
    id: "3",
    name: "7-Day Streak",
    description: "Coded for 7 consecutive days",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    earnedAt: "2 weeks ago",
  },
  {
    id: "4",
    name: "Problem Solver",
    description: "Solved 10 challenges",
    icon: Puzzle,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    earnedAt: "3 weeks ago",
  },
  {
    id: "5",
    name: "Quick Thinker",
    description: "Solved a challenge in under 3 minutes",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    earnedAt: "1 month ago",
  },
]

// Badges that can be earned
const availableBadges = [
  {
    id: "6",
    name: "Math Wizard",
    description: "Solve 5 math-related challenges",
    icon: Sigma,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    progress: 3,
    total: 5,
  },
  {
    id: "7",
    name: "Git Expert",
    description: "Link your GitHub account and have at least 5 repositories",
    icon: GitBranch,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    progress: 0,
    total: 1,
  },
  {
    id: "8",
    name: "Clean Coder",
    description: "Receive 3 'excellent code quality' ratings",
    icon: FileCode2,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    progress: 1,
    total: 3,
  },
  {
    id: "9",
    name: "Innovator",
    description: "Submit a unique solution that's different from 90% of other solutions",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    progress: 0,
    total: 1,
  },
  {
    id: "10",
    name: "Scholar",
    description: "Complete all challenges in a specific category",
    icon: BookOpen,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    progress: 4,
    total: 10,
  },
]

export function UserBadges() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xl font-bold">Earned Badges</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card key={badge.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${badge.bgColor}`}>
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Earned {badge.earnedAt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Badges to Earn</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {availableBadges.map((badge) => (
            <Card key={badge.id} className="border-dashed">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${badge.bgColor} opacity-50`}>
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Progress: {badge.progress}/{badge.total}
                  </p>
                  <p className="text-xs font-medium">{Math.round((badge.progress / badge.total) * 100)}%</p>
                </div>
                <div className="w-full h-2 mt-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${badge.color.replace("text-", "bg-")}`}
                    style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
