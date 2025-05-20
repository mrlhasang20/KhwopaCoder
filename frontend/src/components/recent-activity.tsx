import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle, Clock, Code, Trophy } from "lucide-react"
import Link from "next/link"

// Mock data for recent activity
const activities = [
  {
    id: "1",
    type: "challenge_completed",
    title: "Completed 'Two Sum' Challenge",
    description: "You solved the challenge in 4 minutes and 32 seconds",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    iconColor: "text-green-500",
    link: "/challenge/1",
  },
  {
    id: "2",
    type: "badge_earned",
    title: "Earned 'Algorithm Master' Badge",
    description: "Completed 5 algorithm challenges",
    timestamp: "Yesterday",
    icon: Award,
    iconColor: "text-yellow-500",
    link: "/badges",
  },
  {
    id: "3",
    type: "rank_up",
    title: "Moved up in Leaderboard",
    description: "You are now ranked #12 (up 3 positions)",
    timestamp: "2 days ago",
    icon: Trophy,
    iconColor: "text-blue-500",
    link: "/leaderboard",
  },
  {
    id: "4",
    type: "challenge_attempted",
    title: "Attempted 'Binary Search Tree Validation'",
    description: "You've made progress but haven't completed it yet",
    timestamp: "3 days ago",
    icon: Code,
    iconColor: "text-orange-500",
    link: "/challenge/4",
  },
  {
    id: "5",
    type: "streak",
    title: "7-Day Coding Streak",
    description: "You've been coding for 7 days in a row",
    timestamp: "4 days ago",
    icon: Clock,
    iconColor: "text-purple-500",
    link: "/dashboard",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6 pb-8 last:pb-0">
              <div className="absolute top-0 left-0 w-px h-full bg-border" />
              <div
                className={`absolute top-0 left-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 ${activity.iconColor} bg-background border`}
              >
                <activity.icon className="w-3 h-3" />
              </div>

              <div className="flex flex-col space-y-1">
                <Link href={activity.link} className="font-medium hover:underline">
                  {activity.title}
                </Link>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
