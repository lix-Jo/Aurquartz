'use client'

import { useParams, redirect } from 'next/navigation'
import { SampleForm } from '@/components/samples/sample-form'
import { useApp } from '@/lib/store'

export default function EditSamplePage() {
  const params = useParams()
  const { projects } = useApp()
  
  const project = projects.find(p => p.id === params.id)
  const sample = project?.samples.find(s => s.id === params.sampleId)
  
  if (!project || !sample) {
    redirect('/dashboard/projects')
  }
  
  return <SampleForm projectId={project.id} existingSample={sample} />
}
