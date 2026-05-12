'use client'

import { Sidebar } from './sidebar'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="ml-[72px] md:ml-[260px] min-h-screen"
      >
        <div className="p-6 md:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
