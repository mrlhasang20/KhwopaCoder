import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

// Mock data for challenges
const challenges = {
  recommended: [
    {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      points: 100,
      timeLimit: "5 minutes",
      completed: false,
    },
    {
      id: "2",
      title: "Palindrome Checker",
      difficulty: "Easy",
      category: "Strings",
      points: 100,
      timeLimit: "5 minutes",
      completed: false,
    },
    {
      id: "3",
      title: "Merge Sorted Arrays",
      difficulty: "Medium",
      category: "Arrays",
      points: 200,
      timeLimit: "10 minutes",
      completed: false,
    },
  ],
  inProgress: [
    {
      id: "4",
      title: "Binary Search Tree Validation",
      difficulty: "Hard",
      category: "Trees",
      points: 300,
      timeLimit: "15 minutes",
      completed: false,
      progress: 50,
    },
  ],
  completed: [
    {
      id: "5",
      title: "Reverse Linked List",
      difficulty: "Easy",
      category: "Linked Lists",
      points: 100,
      timeLimit: "5 minutes",
      completed: true,
      completedDate: "2 days ago",
    },
    {
      id: "6",
      title: "Valid Parentheses",
      difficulty: "Easy",
      category: "Stacks",
      points: 100,
      timeLimit: "5 minutes",
      completed: true,
      completedDate: "1 week ago",
    },
  ],
}

export function ChallengeList() {
  return (
    <Tabs defaultValue="recommended" className="w-full">
      <TabsList>
        <TabsTrigger value="recommended">Recommended</TabsTrigger>
        <TabsTrigger value="inProgress">In Progress</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="recommended" className="mt-6">
        <div className="space-y-4">
          {challenges.recommended.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="inProgress" className="mt-6">
        <div className="space-y-4">
          {challenges.inProgress.length > 0 ? (
            challenges.inProgress.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-4 text-muted-foreground">You don't have any challenges in progress</p>
                <Button asChild>
                  <Link href="/challenge/random">Start a Challenge</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <div className="space-y-4">
          {challenges.completed.length > 0 ? (
            challenges.completed.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-4 text-muted-foreground">You haven't completed any challenges yet</p>
                <Button asChild>
                  <Link href="/challenge/random">Start a Challenge</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function ChallengeCard({ challenge }: { challenge: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {challenge.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <div
                className={`w-2 h-2 rounded-full ${
                  challenge.difficulty === "Easy"
                    ? "bg-green-500"
                    : challenge.difficulty === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{challenge.title}</h3>
                <Badge
                  variant={
                    challenge.difficulty === "Easy"
                      ? "success"
                      : challenge.difficulty === "Medium"
                        ? "warning"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{challenge.category}</span>
                <span>•</span>
                <span>{challenge.points} points</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {challenge.timeLimit}
                </div>
              </div>
            </div>
          </div>

          <Button variant="secondary" size="sm" asChild>
            <Link href={`/challenge/${challenge.id}`}>
              {challenge.completed ? "Review" : "Solve"} <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
