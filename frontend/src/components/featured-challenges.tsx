import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Users } from "lucide-react"
import Link from "next/link"

// Mock data for featured challenges
const challenges = [
  {
    id: "1",
    title: "Two Sum",
    description: "Find two numbers in an array that add up to a specific target.",
    difficulty: "Easy",
    solvedBy: 120,
    timeLimit: "5 minutes",
    category: "Arrays",
  },
  {
    id: "2",
    title: "Palindrome Checker",
    description: "Determine if a string is a palindrome considering only alphanumeric characters.",
    difficulty: "Easy",
    solvedBy: 98,
    timeLimit: "5 minutes",
    category: "Strings",
  },
  {
    id: "3",
    title: "Merge Sorted Arrays",
    description: "Merge two sorted arrays into a single sorted array.",
    difficulty: "Medium",
    solvedBy: 75,
    timeLimit: "10 minutes",
    category: "Arrays",
  },
  {
    id: "4",
    title: "Binary Search Tree Validation",
    description: "Validate if a given binary tree is a valid binary search tree.",
    difficulty: "Hard",
    solvedBy: 32,
    timeLimit: "15 minutes",
    category: "Trees",
  },
  {
    id: "5",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    solvedBy: 65,
    timeLimit: "10 minutes",
    category: "Strings",
  },
  {
    id: "6",
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "Easy",
    solvedBy: 88,
    timeLimit: "5 minutes",
    category: "Linked Lists",
  },
]

export function FeaturedChallenges() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <Badge
                  variant={
                    challenge.difficulty === "Easy"
                      ? "success"
                      : challenge.difficulty === "Medium"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {challenge.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span>{challenge.solvedBy} solved</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span>{challenge.timeLimit}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/login">
                  Solve Challenge <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/login">
            View All Challenges <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
