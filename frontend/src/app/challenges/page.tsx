"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, CheckCircle, Clock, Code, Filter, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Mock data for challenges
const allChallenges = [
  {
    id: "1",
    title: "Two Sum",
    description: "Find two numbers in an array that add up to a specific target.",
    difficulty: "Easy",
    category: "Arrays",
    points: 100,
    timeLimit: "5 minutes",
    completed: false,
    solvedBy: 120,
  },
  {
    id: "2",
    title: "Palindrome Checker",
    description: "Determine if a string is a palindrome considering only alphanumeric characters.",
    difficulty: "Easy",
    category: "Strings",
    points: 100,
    timeLimit: "5 minutes",
    completed: false,
    solvedBy: 98,
  },
  {
    id: "3",
    title: "Merge Sorted Arrays",
    description: "Merge two sorted arrays into a single sorted array.",
    difficulty: "Medium",
    category: "Arrays",
    points: 200,
    timeLimit: "10 minutes",
    completed: false,
    solvedBy: 75,
  },
  {
    id: "4",
    title: "Binary Search Tree Validation",
    description: "Validate if a given binary tree is a valid binary search tree.",
    difficulty: "Hard",
    category: "Trees",
    points: 300,
    timeLimit: "15 minutes",
    completed: false,
    solvedBy: 32,
  },
  {
    id: "5",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    category: "Strings",
    points: 200,
    timeLimit: "10 minutes",
    completed: false,
    solvedBy: 65,
  },
  {
    id: "6",
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "Easy",
    category: "Linked Lists",
    points: 100,
    timeLimit: "5 minutes",
    completed: true,
    solvedBy: 88,
  },
  {
    id: "7",
    title: "Valid Parentheses",
    description: "Determine if the input string has valid parentheses.",
    difficulty: "Easy",
    category: "Stacks",
    points: 100,
    timeLimit: "5 minutes",
    completed: true,
    solvedBy: 92,
  },
  {
    id: "8",
    title: "LRU Cache",
    description: "Implement a Least Recently Used (LRU) cache.",
    difficulty: "Hard",
    category: "Design",
    points: 300,
    timeLimit: "20 minutes",
    completed: false,
    solvedBy: 28,
  },
  {
    id: "9",
    title: "Merge K Sorted Lists",
    description: "Merge k sorted linked lists into one sorted linked list.",
    difficulty: "Hard",
    category: "Linked Lists",
    points: 300,
    timeLimit: "20 minutes",
    completed: false,
    solvedBy: 25,
  },
  {
    id: "10",
    title: "Implement Queue using Stacks",
    description: "Implement a queue using only stacks.",
    difficulty: "Medium",
    category: "Stacks",
    points: 200,
    timeLimit: "15 minutes",
    completed: false,
    solvedBy: 60,
  },
  {
    id: "11",
    title: "Rotate Array",
    description: "Rotate an array to the right by k steps.",
    difficulty: "Medium",
    category: "Arrays",
    points: 150,
    timeLimit: "10 minutes",
    completed: false,
    solvedBy: 72,
  },
  {
    id: "12",
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum.",
    difficulty: "Easy",
    category: "Arrays",
    points: 100,
    timeLimit: "5 minutes",
    completed: false,
    solvedBy: 85,
  },
]

export default function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  // Filter challenges based on search and filters
  const filteredChallenges = allChallenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && challenge.completed) ||
      (statusFilter === "incomplete" && !challenge.completed)

    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(allChallenges.map((c) => c.category)))

  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Browse and solve coding challenges</p>
        </div>
        <Button asChild>
          <Link href="/challenge/random">
            <Code className="w-4 h-4 mr-2" />
            Random Challenge
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <CheckCircle className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="easy">Easy</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="hard">Hard</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="easy" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges
              .filter((challenge) => challenge.difficulty === "Easy")
              .map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="medium" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges
              .filter((challenge) => challenge.difficulty === "Medium")
              .map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="hard" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges
              .filter((challenge) => challenge.difficulty === "Hard")
              .map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: any }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium">{challenge.title}</h3>
            <Badge
              variant={
                challenge.difficulty === "Easy"
                  ? "default"
                  : challenge.difficulty === "Medium"
                    ? "secondary"
                    : "destructive"
              }
            >
              {challenge.difficulty}
            </Badge>
          </div>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{challenge.category}</span>
              <span>•</span>
              <span>{challenge.points} pts</span>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {challenge.timeLimit}
              </div>
            </div>
            {challenge.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        </div>
        <div className="p-4 border-t bg-muted/30">
          <Button variant="secondary" size="sm" className="w-full" asChild>
            <Link href={`/challenge/${challenge.id}`}>
              {challenge.completed ? "Review Solution" : "Solve Challenge"} <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
