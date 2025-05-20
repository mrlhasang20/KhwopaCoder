import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, CheckCircle, Clock, Code2, Flame, Star } from "lucide-react"

export function UserStats() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Solved</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Points</p>
              <p className="text-2xl font-bold">1,250</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Badges</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Streak</p>
              <p className="text-2xl font-bold">7 days</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-sm font-medium">20%</p>
          </div>
          <Progress value={20} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Code2 className="w-3 h-3 mr-1" />
              24 solved
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              96 remaining
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
