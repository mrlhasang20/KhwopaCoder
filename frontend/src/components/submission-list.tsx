"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import axios from "axios"

type Submission = {
  id: string
  challenge_id: string
  challenge_title: string
  user_id: string
  user_name: string
  code: string
  language: string
  status: string
  runtime: number | null
  memory: number | null
  created_at: string
}

export function SubmissionList({ challengeId }: { challengeId?: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const url = challengeId
          ? `${process.env.NEXT_PUBLIC_API_URL}/submissions/challenge/${challengeId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/submissions/user/${user?.id}`
        
        const response = await axios.get(url)
        setSubmissions(response.data)
      } catch (error) {
        console.error("Error fetching submissions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchSubmissions()
    }
  }, [user, challengeId])

  if (isLoading) {
    return <div>Loading submissions...</div>
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{submission.challenge_title}</CardTitle>
                <CardDescription>
                  Submitted by {submission.user_name} on{" "}
                  {new Date(submission.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge
                variant={
                  submission.status === "ACCEPTED"
                    ? "default"
                    : submission.status === "WRONG_ANSWER"
                    ? "destructive"
                    : "default"
                }
              >
                {submission.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Language: {submission.language}</span>
                {submission.runtime && (
                  <span>Runtime: {submission.runtime}ms</span>
                )}
                {submission.memory && (
                  <span>Memory: {submission.memory}MB</span>
                )}
              </div>
              <pre className="p-4 mt-2 overflow-x-auto text-sm bg-muted rounded-lg">
                <code>{submission.code}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
