'use client'

import { useParams, redirect } from 'next/navigation'
import { SampleForm } from '@/components/samples/sample-form'
import { useApp } from '@/lib/store'

export default function NewSamplePage() {
  const params = useParams()
  const { projects } = useApp()
  
  const project = projects.find(p => p.id === params.id)
  
  if (!project) {
    redirect('/dashboard/projects')
  }
  
  return <SampleForm projectId={project.id} />
}
