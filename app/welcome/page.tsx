'use client'

import { WelcomeScreen } from '@/components/auth/welcome-screen'
import { useApp } from '@/lib/store'
import { redirect } from 'next/navigation'

export default function WelcomePage() {
  const { isAuthenticated } = useApp()
  
  if (!isAuthenticated) {
    redirect('/')
  }
  
  return <WelcomeScreen />
}
