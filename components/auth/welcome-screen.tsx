'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Compass, ArrowRight, Mountain, Layers, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'

export function WelcomeScreen() {
  const router = useRouter()
  const { user } = useApp()

  const features = [
    { 
      icon: Mountain, 
      title: 'Document Samples',
      description: 'Record detailed geological observations with our comprehensive sample forms'
    },
    { 
      icon: MapPin, 
      title: 'Interactive Mapping',
      description: 'Visualize your sample locations on interactive geological maps'
    },
    { 
      icon: Layers, 
      title: 'Data Management',
      description: 'Organize, search, and export your field data with powerful tools'
    },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6 shadow-lg shadow-primary/20">
            <Compass className="w-11 h-11 text-primary-foreground" />
          </div>

          {/* Welcome message */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to Aurquartz
            {user && !user.isGuest && (
              <span className="block text-2xl md:text-3xl font-normal text-muted-foreground mt-2">
                Hello, {user.email.split('@')[0]}
              </span>
            )}
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Your professional platform for geological fieldwork management. 
            Document samples, map locations, and analyze data with ease.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            onClick={() => router.push('/dashboard/projects')}
            className="px-8 py-6 text-lg shadow-lg shadow-primary/20"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {user?.isGuest && (
            <p className="text-sm text-muted-foreground mt-4">
              You are using guest mode. Your data will not be saved.
            </p>
          )}
        </motion.div>

        {/* Decorative illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex justify-center items-end gap-4"
        >
          <div className="w-12 h-24 bg-stone-light rounded-t-lg opacity-60" />
          <div className="w-16 h-36 bg-primary/20 rounded-t-lg" />
          <div className="w-20 h-48 bg-primary/30 rounded-t-lg" />
          <div className="w-14 h-32 bg-accent/30 rounded-t-lg" />
          <div className="w-10 h-20 bg-stone-light rounded-t-lg opacity-60" />
        </motion.div>
      </div>
    </div>
  )
}
