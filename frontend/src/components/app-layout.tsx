"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Public routes that don't need authentication
  const isPublicRoute = pathname === "/login" || pathname === "/register"

  useEffect(() => {
    // If user is not logged in and trying to access a protected route, redirect to login
    if (!user && !isPublicRoute) {
      router.push("/login")
    }
    // If user is logged in and on the root path, redirect to dashboard
    if (user && pathname === "/") {
      router.push("/dashboard")
    }
  }, [user, isPublicRoute, router, pathname])

  // For public routes, don't show the sidebar
  if (isPublicRoute) {
    return <main className="min-h-screen">{children}</main>
  }

  // If not logged in, show nothing (will redirect in useEffect)
  if (!user) {
    return null
  }

  // For authenticated users on protected routes, show the sidebar
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex items-center h-12 px-4 border-b bg-background">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1"></div>
          </div>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
