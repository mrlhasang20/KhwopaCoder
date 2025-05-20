"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// List of challenge IDs to randomly select from
const challengeIds = ["1", "2", "3", "4", "5", "6"]

export default function RandomChallengePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Select a random challenge ID
    const randomIndex = Math.floor(Math.random() * challengeIds.length)
    const randomChallengeId = challengeIds[randomIndex]

    // Redirect to the random challenge
    router.push(`/challenge/${randomChallengeId}`)
  }, [router, user])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        <h1 className="text-2xl font-bold">Finding a random challenge for you...</h1>
        <p className="text-muted-foreground">Please wait while we select a challenge</p>
      </div>
    </div>
  )
}
