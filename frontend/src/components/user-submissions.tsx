import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock, Code, ExternalLink, XCircle } from "lucide-react"
import Link from "next/link"

// Mock data for user submissions
const submissions = [
  {
    id: "1",
    challengeId: "1",
    challengeName: "Two Sum",
    difficulty: "Easy",
    status: "Accepted",
    submittedAt: "2 days ago",
    runtime: "120ms",
    memory: "42.1 MB",
    language: "JavaScript",
  },
  {
    id: "2",
    challengeId: "5",
    challengeName: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    status: "Accepted",
    submittedAt: "3 days ago",
    runtime: "88ms",
    memory: "45.3 MB",
    language: "JavaScript",
  },
  {
    id: "3",
    challengeId: "3",
    challengeName: "Merge Sorted Arrays",
    difficulty: "Medium",
    status: "Accepted",
    submittedAt: "1 week ago",
    runtime: "76ms",
    memory: "40.2 MB",
    language: "JavaScript",
  },
  {
    id: "4",
    challengeId: "4",
    challengeName: "Binary Search Tree Validation",
    difficulty: "Hard",
    status: "Wrong Answer",
    submittedAt: "1 week ago",
    runtime: "N/A",
    memory: "N/A",
    language: "JavaScript",
  },
  {
    id: "5",
    challengeId: "6",
    challengeName: "Reverse Linked List",
    difficulty: "Easy",
    status: "Accepted",
    submittedAt: "2 weeks ago",
    runtime: "64ms",
    memory: "38.7 MB",
    language: "JavaScript",
  },
]

export function UserSubmissions() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Challenge</TableHead>
              <TableHead className="hidden md:table-cell">Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead className="hidden md:table-cell">Runtime</TableHead>
              <TableHead className="hidden lg:table-cell">Memory</TableHead>
              <TableHead className="hidden lg:table-cell">Language</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.challengeName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={
                      submission.difficulty === "Easy"
                        ? "success"
                        : submission.difficulty === "Medium"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {submission.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {submission.status === "Accepted" ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-green-500">Accepted</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1 text-red-500" />
                        <span className="text-red-500">Failed</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {submission.submittedAt}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{submission.runtime}</TableCell>
                <TableCell className="hidden lg:table-cell">{submission.memory}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-1" />
                    {submission.language}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/challenge/${submission.challengeId}`}>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
