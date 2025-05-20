"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Search } from "lucide-react"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { TopPerformers } from "@/components/top-performers"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function LeaderboardPage() {
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
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among your peers</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <TopPerformers />

      <Card className="p-6">
        <Tabs defaultValue="overall" className="w-full">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
            <TabsList>
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>

            <div className="flex items-center w-full gap-4 md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10" />
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="2023">Batch 2023</SelectItem>
                  <SelectItem value="2022">Batch 2022</SelectItem>
                  <SelectItem value="2021">Batch 2021</SelectItem>
                  <SelectItem value="2020">Batch 2020</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="overall" className="m-0">
            <LeaderboardTable />
          </TabsContent>

          <TabsContent value="monthly" className="m-0">
            <LeaderboardTable period="monthly" />
          </TabsContent>

          <TabsContent value="weekly" className="m-0">
            <LeaderboardTable period="weekly" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
