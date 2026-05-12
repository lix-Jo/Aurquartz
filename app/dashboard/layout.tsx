'use client'

import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useApp } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function LoadingSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useApp()
  const router = useRouter()
  
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/')
    }
  }, [isHydrated, isAuthenticated, router])
  
  // Show loading skeleton while hydrating
  if (!isHydrated) {
    return <LoadingSkeleton />
  }
  
  // Redirect will happen via useEffect
  if (!isAuthenticated) {
    return <LoadingSkeleton />
  }
  
  return <DashboardShell>{children}</DashboardShell>
}
