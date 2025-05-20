"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Github, Linkedin, MapPin, Medal, Settings, Share2 } from "lucide-react"
import Link from "next/link"
import { UserSubmissions } from "@/components/user-submissions"
import { UserBadges } from "@/components/user-badges"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
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

  return (
    <div className="space-y-8 w-full max-w-full">
      <Card className="overflow-hidden border-none shadow-none bg-muted/30">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        <div className="p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-background -mt-14">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-normal">
                    <MapPin className="w-3 h-3 mr-1" />
                    Computer Engineering
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    Batch {user.batch}
                  </Badge>
                  <div className="flex items-center gap-2 ml-1">
                    <Link href="https://github.com/rahulsharma" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </Link>
                    <Link href="https://linkedin.com/in/rahulsharma" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ranking</CardTitle>
            <CardDescription>Current position on leaderboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full bg-primary/10 text-primary">
                12
              </div>
              <div className="space-y-1">
                <div className="text-sm">Top 10%</div>
                <div className="text-sm text-muted-foreground">Among 250 students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Challenges</CardTitle>
            <CardDescription>Solved vs total available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">24</span>
                <span className="text-sm text-muted-foreground">of 120 total</span>
              </div>
              <Progress value={20} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-medium">Easy</div>
                  <div className="text-sm text-green-500">15/40</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Medium</div>
                  <div className="text-sm text-yellow-500">8/50</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Hard</div>
                  <div className="text-sm text-red-500">1/30</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>Badges and awards earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Medal className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-medium">5 Badges</div>
                  <div className="text-sm text-muted-foreground">Latest: Algorithm Master</div>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/badges">View All Badges</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submissions" className="w-full">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="badges" id="badges">
            Badges & Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6">
          <UserSubmissions />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <UserBadges />
        </TabsContent>
      </Tabs>
    </div>
  )
}
