"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GithubIcon, LinkedinIcon, Save, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [achievementNotifications, setAchievementNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [compactView, setCompactView] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Initialize form with user data
    setName(user.name)
    setEmail(user.email)
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      })
    }, 1000)
  }

  const handleSaveAppearance = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Appearance settings updated",
        description: "Your appearance preferences have been saved.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-8 w-full max-w-full">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and social profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=80&width=80"} alt={user.name} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="mb-1 font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a new profile picture. JPG, GIF or PNG. Max 1MB.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                  <p className="text-xs text-muted-foreground">Your college email cannot be changed</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Username</Label>
                  <div className="relative">
                    <Input
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="Your GitHub username"
                    />
                    <GithubIcon className="absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Username</Label>
                  <div className="relative">
                    <Input
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="Your LinkedIn username"
                    />
                    <LinkedinIcon className="absolute w-4 h-4 transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications about your activity via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Achievement Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you earn badges or reach milestones
                    </p>
                  </div>
                  <Switch checked={achievementNotifications} onCheckedChange={setAchievementNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your progress and new challenges
                    </p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how KhwopaCoder looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compact View</h3>
                    <p className="text-sm text-muted-foreground">Reduce spacing and show more content on screen</p>
                  </div>
                  <Switch checked={compactView} onCheckedChange={setCompactView} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAppearance} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Update your password to keep your account secure</p>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button className="mt-4">Update Password</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-destructive">Danger Zone</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Permanently delete your account and all your data
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
