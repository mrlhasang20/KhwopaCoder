"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Clock, Flame, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ChallengeList } from "@/components/challenge-list"
import { UserStats } from "@/components/user-stats"
import { RecentActivity } from "@/components/recent-activity"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("Dashboard mounted, checking auth state:", { user });
    
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (!token || !storedUser) {
          console.log("No auth data found, redirecting to login");
          router.replace("/login");
          return;
        }

        // Parse and validate stored user data
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser || !parsedUser.id) {
          console.log("Invalid user data, redirecting to login");
          router.replace("/login");
          return;
        }

        console.log("Auth data found, user should be authenticated");
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and take on new challenges</p>
        </div>
        <Button asChild>
          <Link href="/challenge/random">
            <Flame className="w-4 h-4 mr-2" />
            Start Coding
          </Link>
        </Button>
      </div>

      <UserStats />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Rank</CardTitle>
            <CardDescription>Among all Khwopa students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full bg-primary/10 text-primary">
                12
              </div>
              <div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  Up 3 positions this week
                </div>
                <div className="mt-1 text-sm">Top 10% of all students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Challenges Completed</CardTitle>
            <CardDescription>Your progress so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">24</span>
                <span className="text-sm text-muted-foreground">of 120 total</span>
              </div>
              <Progress value={20} className="h-2" />
              <div className="flex items-center text-sm text-muted-foreground">
                <Award className="w-4 h-4 mr-1 text-yellow-500" />
                Earned 5 badges
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Coding Streak</CardTitle>
            <CardDescription>Days of consistent coding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full bg-primary/10 text-primary">
                  7
                </div>
                <div>
                  <div className="flex items-center text-sm">
                    <Flame className="w-4 h-4 mr-1 text-orange-500" />
                    Current streak
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">Best: 14 days</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                Last coded: Today
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="mt-6">
          <ChallengeList />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  ) 
{/* <h1>Hello man</h1> */}
}
