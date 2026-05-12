'use client'

import { useParams, redirect } from 'next/navigation'
import { ProjectDetail } from '@/components/projects/project-detail'
import { useApp } from '@/lib/store'

export default function ProjectDetailPage() {
  const params = useParams()
  const { projects } = useApp()
  
  const project = projects.find(p => p.id === params.id)
  
  if (!project) {
    redirect('/dashboard/projects')
  }
  
  return <ProjectDetail project={project} />
}
