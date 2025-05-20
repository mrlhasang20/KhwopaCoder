"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Clock, Code, Info, Play, Save, Terminal } from "lucide-react"
import Link from "next/link"
import { CodeEditor } from "@/components/code-editor"
import { TestCases } from "@/components/test-cases"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SubmissionList } from "@/components/submission-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"

export default function ChallengePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [challenge, setChallenge] = useState<any>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Get challenge data
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${id}`)
        setChallenge(response.data)
        setCode(response.data.starterCode || "")
      } catch (error) {
        console.error("Error fetching challenge:", error)
        toast({
          title: "Challenge not found",
          description: "The challenge you're looking for doesn't exist.",
          variant: "destructive",
        })
        router.push("/challenges")
      }
    }

    if (id) {
      fetchChallenge()
    }
  }, [id, user, router, toast])

  const handleTabFocus = useCallback(() => {
    toast({
      title: "Warning: Tab switching detected",
      description: "Switching tabs during a challenge is not allowed. This will be recorded.",
      variant: "destructive",
    })
  }, [toast])

  // Add event listeners for tab visibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleTabFocus)

      return () => {
        document.removeEventListener("visibilitychange", handleTabFocus)
      }
    }
  }, [handleTabFocus])

  if (!user || !challenge) {
    return null
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setActiveTab("results")

    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false)
      setTestResults({
        passed: 2,
        failed: 1,
        results: [
          {
            input: challenge.testCases[0].input,
            expected: challenge.testCases[0].output,
            actual: "[0,1]",
            passed: true,
          },
          {
            input: challenge.testCases[1].input,
            expected: challenge.testCases[1].output,
            actual: "[1,2]",
            passed: true,
          },
          {
            input: challenge.testCases[2].input,
            expected: challenge.testCases[2].output,
            actual: "[1,0]",
            passed: false,
          },
        ],
      })
    }, 2000)
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
        challenge_id: id,
        code,
        language,
      })

      toast({
        title: "Success",
        description: "Your submission has been received",
      })

      // Refresh the page to show the new submission
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your code",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{challenge.title}</CardTitle>
            <Badge variant={challenge.difficulty === "EASY" ? "default" : challenge.difficulty === "MEDIUM" ? "secondary" : "destructive"}>
              {challenge.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: challenge.description }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              className="font-mono h-[300px]"
            />

            <div className="flex gap-4">
              <Button onClick={handleRunCode} disabled={isRunning}>
                {isRunning ? "Running..." : "Run Code"}
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionList challengeId={id as string} />
        </CardContent>
      </Card>
    </div>
  )
}
