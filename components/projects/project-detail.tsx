'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Calendar, 
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Save,
  X,
  Mic
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp } from '@/lib/store'
import type { Project, ProjectStatus, Sample } from '@/lib/types'
import { colorOptions, weatheringOptions } from '@/lib/geological-data'
import { toast } from 'sonner'

interface ProjectDetailProps {
  project: Project
}

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  draft: { label: 'Draft', variant: 'secondary' },
  complete: { label: 'Complete', variant: 'outline' }
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-12" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ProjectDetail({ project: initialProject }: ProjectDetailProps) {
  const router = useRouter()
  const { projects, updateProject, deleteSample, isHydrated } = useApp()
  
  // Get fresh project data from store
  const project = projects.find(p => p.id === initialProject.id) || initialProject
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: project.name,
    location: project.location,
    date: project.date,
    status: project.status,
    description: project.description
  })
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null)

  const handleSaveEdit = () => {
    updateProject(project.id, editData)
    setIsEditing(false)
    toast.success('Project updated', {
      description: 'Your changes have been saved'
    })
  }

  const handleDeleteSample = (sampleId: string, sampleName: string) => {
    if (confirm('Are you sure you want to delete this sample?')) {
      deleteSample(project.id, sampleId)
      toast.success('Sample deleted', {
        description: `${sampleName} has been removed`
      })
    }
  }

  const getColorLabel = (value: string) => {
    return colorOptions.find(o => o.value === value)?.label || value
  }

  const getWeatheringLabel = (value: string) => {
    return weatheringOptions.find(o => o.value === value)?.label || value
  }

  if (!isHydrated) {
    return <ProjectDetailSkeleton />
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="text-2xl font-bold h-auto py-1"
            />
          ) : (
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          )}
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {project.location || 'No location'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.date).toLocaleDateString()}
            </span>
            <Badge variant={statusConfig[project.status].variant}>
              {statusConfig[project.status].label}
            </Badge>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => router.push(`/dashboard/projects/${project.id}/samples/new`)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sample
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Edit form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editData.status}
                    onValueChange={(v) => setEditData(prev => ({ ...prev, status: v as ProjectStatus }))}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project description */}
      {!isEditing && project.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Samples */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Samples ({project.samples.length})</h2>
        </div>

        {project.samples.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No samples yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                Start documenting geological samples for this project
              </p>
              <Button onClick={() => router.push(`/dashboard/projects/${project.id}/samples/new`)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Sample
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {project.samples.map((sample, index) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="font-mono text-primary">{sample.sampleNumber}</span>
                            <span className="text-muted-foreground font-normal">-</span>
                            <span>{sample.sampleName}</span>
                            {sample.voiceRecordings && sample.voiceRecordings.length > 0 && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                <Mic className="w-3 h-3 mr-1" />
                                {sample.voiceRecordings.length}
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {sample.rockName || 'Unknown rock'} 
                            {sample.rockCategory && ` (${sample.rockCategory})`}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedSample(sample)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${project.id}/samples/${sample.id}/edit`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteSample(sample.id, sample.sampleName)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Color</p>
                          <p className="font-medium">{getColorLabel(sample.color) || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Weathering</p>
                          <p className="font-medium">{getWeatheringLabel(sample.weathering) || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coordinates</p>
                          <p className="font-medium font-mono text-xs">
                            {sample.coordinates.latitude && sample.coordinates.longitude
                              ? `${sample.coordinates.latitude.toFixed(4)}, ${sample.coordinates.longitude.toFixed(4)}`
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date(sample.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {sample.fieldNotes && (
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2 border-t border-border pt-4">
                          {sample.fieldNotes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Action Button for mobile */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 md:hidden"
      >
        <Button
          size="lg"
          onClick={() => router.push(`/dashboard/projects/${project.id}/samples/new`)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Sample Detail Dialog */}
      <Dialog open={!!selectedSample} onOpenChange={() => setSelectedSample(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSample && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-primary">{selectedSample.sampleNumber}</span>
                  <span>-</span>
                  <span>{selectedSample.sampleName}</span>
                </DialogTitle>
                <DialogDescription>
                  Sample details and geological data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                {/* Basic Info */}
                <div>
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Coordinates</p>
                      <p className="font-mono">
                        {selectedSample.coordinates.latitude?.toFixed(6)}, {selectedSample.coordinates.longitude?.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p>{new Date(selectedSample.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Geological Data */}
                <div>
                  <h4 className="font-semibold mb-3">Geological Data</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rock Category</p>
                      <p>{selectedSample.rockCategory || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Subcategory</p>
                      <p>{selectedSample.rockSubcategory || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rock Name</p>
                      <p className="font-medium">{selectedSample.rockName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Grain Size</p>
                      <p>{selectedSample.grainSize || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Color</p>
                      <p>{getColorLabel(selectedSample.color) || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weathering</p>
                      <p>{getWeatheringLabel(selectedSample.weathering) || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Mineralization */}
                <div>
                  <h4 className="font-semibold mb-3">Mineralization & Alteration</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Mineralization</p>
                      <p>{selectedSample.mineralization || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alteration Type</p>
                      <p>{selectedSample.alterationType || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alteration Intensity</p>
                      <p>{selectedSample.alterationIntensity}/5</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hardness</p>
                      <p>{selectedSample.hardness}/10</p>
                    </div>
                  </div>
                </div>

                {/* Structural */}
                {selectedSample.structuralFeature && (
                  <div>
                    <h4 className="font-semibold mb-3">Structural Measurements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Feature</p>
                        <p>{selectedSample.structuralFeature}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Strike</p>
                        <p>{selectedSample.strike !== null ? `${selectedSample.strike}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dip</p>
                        <p>{selectedSample.dip !== null ? `${selectedSample.dip}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dip Direction</p>
                        <p>{selectedSample.dipDirection || '-'}</p>
                      </div>
                    </div>
                    {selectedSample.structuralNotes && (
                      <p className="text-sm text-muted-foreground mt-2">{selectedSample.structuralNotes}</p>
                    )}
                  </div>
                )}

                {/* Voice Recordings */}
                {selectedSample.voiceRecordings && selectedSample.voiceRecordings.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Voice Recordings ({selectedSample.voiceRecordings.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSample.voiceRecordings.map((recording) => (
                        <div 
                          key={recording.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <audio controls src={recording.audioUrl} className="flex-1 h-8" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(recording.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Field Notes */}
                {selectedSample.fieldNotes && (
                  <div>
                    <h4 className="font-semibold mb-3">Field Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedSample.fieldNotes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
