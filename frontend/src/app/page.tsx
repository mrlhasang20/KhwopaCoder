import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Code, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeaturedChallenges } from "@/components/featured-challenges"
import { TopCoders } from "@/components/top-coders"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center">
            <Code className="w-6 h-6 mr-2 text-primary" />
            <span className="text-xl font-bold">
              Khwopa<span className="text-primary">Coder</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login?tab=register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <HeroSection />

      <div className="container px-4 py-12 mx-auto">
        <Tabs defaultValue="featured" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Explore KhwopaCoder</h2>
            <TabsList>
              <TabsTrigger value="featured">Featured Challenges</TabsTrigger>
              <TabsTrigger value="coders">Top Coders</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured" className="mt-0">
            <FeaturedChallenges />
          </TabsContent>

          <TabsContent value="coders" className="mt-0">
            <TopCoders />
          </TabsContent>
        </Tabs>
      </div>

      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">Why KhwopaCoder?</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Code className="w-12 h-12 p-2 mb-2 rounded-lg bg-primary/10 text-primary" />
                <CardTitle>Improve Coding Skills</CardTitle>
                <CardDescription>
                  Practice with real-world challenges designed to enhance your programming abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                Solve problems ranging from basic algorithms to advanced data structures. Each challenge is designed to
                teach you valuable coding concepts.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-12 h-12 p-2 mb-2 rounded-lg bg-primary/10 text-primary" />
                <CardTitle>Compete & Rank</CardTitle>
                <CardDescription>See where you stand among your peers and climb the leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                Your solutions are evaluated for correctness, efficiency, and code quality. Earn points and badges as
                you solve more challenges.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 p-2 mb-2 rounded-lg bg-primary/10 text-primary" />
                <CardTitle>Build Your Network</CardTitle>
                <CardDescription>
                  Connect with fellow students and showcase your skills to potential employers
                </CardDescription>
              </CardHeader>
              <CardContent>
                Link your GitHub and LinkedIn profiles. Get noticed by companies looking for talented developers from
                Khwopa Engineering College.
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary" />
              <span className="font-bold">
                Khwopa<span className="text-primary">Coder</span>
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KhwopaCoder. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
