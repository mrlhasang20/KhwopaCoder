"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GithubIcon, LinkedinIcon, Code, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, login, register } = useAuth()
  const [error, setError] = useState("")

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const userData = await login(email, password)
      
      // Show success toast
      toast({
        title: "Logged in successfully",
        description: "Welcome back to KhwopaCoder!",
      })
      
      // Use router.replace instead of push to prevent back navigation
      router.replace("/dashboard")
      
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register({ name, email, password })
      toast({
        title: "Registration successful",
        description: "Welcome to KhwopaCoder! Your account has been created.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <Link href="/" className="flex items-center">
            <Code className="w-6 h-6 mr-2 text-primary" />
            <span className="text-xl font-bold">
              Khwopa<span className="text-primary">Coder</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Welcome to KhwopaCoder</h1>
              <p className="mt-2 text-muted-foreground">Join the coding community at Khwopa Engineering College</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-t-0 rounded-tl-none rounded-tr-none">
                  <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your college email and password to access your account</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">College Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="rollno@khec.edu.np"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button type="submit"  className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                      </Button>
                      <p className="text-sm text-center text-muted-foreground">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => setActiveTab("register")}
                        >
                          Register
                        </button>
                      </p>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-t-0 rounded-tl-none rounded-tr-none">
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Register with your college email to join KhwopaCoder</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-name">Full Name</Label>
                        <Input
                          id="reg-name"
                          placeholder="Your full name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">College Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="rollno@khec.edu.np"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Must be a valid Khwopa Engineering College email
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Social Profiles (Optional)</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input placeholder="GitHub Username" />
                            <GithubIcon className="absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
                          </div>
                          <div className="relative flex-1">
                            <Input placeholder="LinkedIn Username" />
                            <LinkedinIcon className="absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Register"}
                      </Button>
                      <p className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => setActiveTab("login")}
                        >
                          Login
                        </button>
                      </p>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
