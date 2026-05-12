'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Save, 
  X, 
  Plus,
  Camera,
  Upload,
  Trash2,
  Navigation,
  Mic,
  Square,
  Play,
  Pause,
  FileAudio,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useApp } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { 
  rockDatabase, 
  colorOptions, 
  weatheringOptions, 
  mineralizationOptions, 
  alterationTypeOptions,
  structuralFeatureOptions,
  grainSizeOptions,
  calculateDipDirection,
  getSubcategories,
  getRocksForSubcategory
} from '@/lib/geological-data'
import type { Sample, Coordinates, VoiceRecording } from '@/lib/types'

interface SampleFormProps {
  projectId: string
  existingSample?: Sample
  onCancel?: () => void
}

type SectionKey = 'basic' | 'geological' | 'mineralization' | 'structural' | 'photos' | 'notes'

// Voice Recording Component
function VoiceRecorder({ 
  recordings, 
  onAddRecording, 
  onDeleteRecording 
}: { 
  recordings: VoiceRecording[]
  onAddRecording: (recording: VoiceRecording) => void
  onDeleteRecording: (id: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const newRecording: VoiceRecording = {
          id: `rec-${Date.now()}`,
          audioUrl,
          duration: recordingTime,
          createdAt: new Date().toISOString()
        }
        
        onAddRecording(newRecording)
        setRecordingTime(0)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('[v0] Error accessing microphone:', error)
      alert('Unable to access microphone. Please enable microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const togglePlayback = (recording: VoiceRecording) => {
    if (playingId === recording.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(recording.audioUrl)
      audioRef.current.onended = () => setPlayingId(null)
      audioRef.current.play()
      setPlayingId(recording.id)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Recording controls */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        {!isRecording ? (
          <Button 
            type="button" 
            onClick={startRecording}
            variant="default"
            className="gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button 
              type="button" 
              onClick={stopRecording}
              variant="destructive"
              className="gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
            </div>
          </>
        )}
      </div>

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Saved Recordings</p>
          {recordings.map((recording) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePlayback(recording)}
                  className="h-8 w-8"
                >
                  {playingId === recording.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Recording {new Date(recording.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(recording.duration)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRecording(recording.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SampleForm({ projectId, existingSample, onCancel }: SampleFormProps) {
  const router = useRouter()
  const { addSample, updateSample, currentProject, saveDraftForm, getDraftForm, clearDraftForm, saveStatus } = useApp()
  const draftKey = `sample-form-${projectId}-${existingSample?.id || 'new'}`
  
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(['basic', 'geological'])
  )

  const [formData, setFormData] = useState<Omit<Sample, 'id' | 'projectId' | 'createdAt'>>(() => {
    // Try to load draft first
    if (typeof window !== 'undefined') {
      const draft = getDraftForm(draftKey)
      if (draft && !existingSample) {
        return draft as Omit<Sample, 'id' | 'projectId' | 'createdAt'>
      }
    }
    
    return {
      sampleNumber: existingSample?.sampleNumber || '',
      sampleName: existingSample?.sampleName || '',
      coordinates: existingSample?.coordinates || { latitude: null, longitude: null },
      rockCategory: existingSample?.rockCategory || '',
      rockSubcategory: existingSample?.rockSubcategory || '',
      rockName: existingSample?.rockName || '',
      rockType: existingSample?.rockType || '',
      grainSize: existingSample?.grainSize || '',
      color: existingSample?.color || '',
      weathering: existingSample?.weathering || '',
      mineralization: existingSample?.mineralization || '',
      alterationType: existingSample?.alterationType || '',
      alterationIntensity: existingSample?.alterationIntensity || 0,
      hardness: existingSample?.hardness || 5,
      structuralFeature: existingSample?.structuralFeature || '',
      strike: existingSample?.strike || null,
      dip: existingSample?.dip || null,
      dipDirection: existingSample?.dipDirection || '',
      structuralNotes: existingSample?.structuralNotes || '',
      photos: existingSample?.photos || [],
      fieldNotes: existingSample?.fieldNotes || '',
      voiceRecordings: existingSample?.voiceRecordings || []
    }
  })

  // Auto-save draft on form changes
  useEffect(() => {
    if (!existingSample) {
      const timeout = setTimeout(() => {
        saveDraftForm(draftKey, formData)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [formData, draftKey, existingSample, saveDraftForm])

  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleUseCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          updateField('coordinates', coords)
        },
        (error) => {
          console.error('[v0] Geolocation error:', error)
          alert('Unable to get location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }, [])

  const handleStrikeChange = (value: string) => {
    const strike = value === '' ? null : parseInt(value)
    updateField('strike', strike)
    if (strike !== null && !isNaN(strike)) {
      updateField('dipDirection', calculateDipDirection(strike))
    }
  }

  const handleAddVoiceRecording = useCallback((recording: VoiceRecording) => {
    updateField('voiceRecordings', [...formData.voiceRecordings, recording])
  }, [formData.voiceRecordings])

  const handleDeleteVoiceRecording = useCallback((id: string) => {
    updateField('voiceRecordings', formData.voiceRecordings.filter(r => r.id !== id))
  }, [formData.voiceRecordings])

  const handleSave = () => {
    if (!formData.sampleNumber.trim() || !formData.sampleName.trim()) {
      alert('Please fill in sample number and name')
      return
    }

    if (existingSample) {
      updateSample(projectId, existingSample.id, formData)
    } else {
      addSample(projectId, formData)
      // Clear draft after successful save
      clearDraftForm(draftKey)
    }
    
    router.push(`/dashboard/projects/${projectId}`)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push(`/dashboard/projects/${projectId}`)
    }
  }

  const subcategories = formData.rockCategory ? getSubcategories(formData.rockCategory) : []
  const rocks = formData.rockCategory && formData.rockSubcategory 
    ? getRocksForSubcategory(formData.rockCategory, formData.rockSubcategory) 
    : []

  const SectionHeader = ({ 
    title, 
    section, 
    icon: Icon 
  }: { 
    title: string
    section: SectionKey
    icon: React.ElementType 
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-t-xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {existingSample ? 'Edit Sample' : 'Add New Sample'}
          </h1>
          <p className="text-muted-foreground">
            {currentProject?.name || 'Project'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Save status indicator */}
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Auto-saving...
            </div>
          )}
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Sample
          </Button>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-4">
        {/* Section 1: Basic Information */}
        <Card>
          <SectionHeader title="Basic Information" section="basic" icon={MapPin} />
          <AnimatePresence>
            {expandedSections.has('basic') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sampleNumber">Sample Number *</Label>
                      <Input
                        id="sampleNumber"
                        placeholder="e.g., CR-001"
                        value={formData.sampleNumber}
                        onChange={(e) => updateField('sampleNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sampleName">Sample Name *</Label>
                      <Input
                        id="sampleName"
                        placeholder="e.g., Quartz Vein Sample A"
                        value={formData.sampleName}
                        onChange={(e) => updateField('sampleName', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Location</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleUseCurrentLocation}>
                        <Navigation className="w-4 h-4 mr-2" />
                        Use Current Location
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude" className="text-sm text-muted-foreground">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.000001"
                          placeholder="-90 to 90"
                          value={formData.coordinates.latitude ?? ''}
                          onChange={(e) => updateField('coordinates', {
                            ...formData.coordinates,
                            latitude: e.target.value ? parseFloat(e.target.value) : null
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-sm text-muted-foreground">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.000001"
                          placeholder="-180 to 180"
                          value={formData.coordinates.longitude ?? ''}
                          onChange={(e) => updateField('coordinates', {
                            ...formData.coordinates,
                            longitude: e.target.value ? parseFloat(e.target.value) : null
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Section 2: Geological Data */}
        <Card>
          <SectionHeader title="Geological Data" section="geological" icon={MapPin} />
          <AnimatePresence>
            {expandedSections.has('geological') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-4">
                  {/* Rock Selection Hierarchy */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Rock Category</Label>
                      <Select
                        value={formData.rockCategory}
                        onValueChange={(v) => {
                          updateField('rockCategory', v)
                          updateField('rockSubcategory', '')
                          updateField('rockName', '')
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {rockDatabase.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subcategory</Label>
                      <Select
                        value={formData.rockSubcategory}
                        onValueChange={(v) => {
                          updateField('rockSubcategory', v)
                          updateField('rockName', '')
                        }}
                        disabled={!formData.rockCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rock Name</Label>
                      <Select
                        value={formData.rockName}
                        onValueChange={(v) => updateField('rockName', v)}
                        disabled={!formData.rockSubcategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rock" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {rocks.map((rock) => (
                            <SelectItem key={rock} value={rock}>{rock}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Grain Size / Texture - only field here now (Rock Type removed) */}
                  <div className="space-y-2">
                    <Label>Grain Size / Texture / Fabric</Label>
                    <Select value={formData.grainSize} onValueChange={(v) => updateField('grainSize', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grain size / texture" />
                      </SelectTrigger>
                      <SelectContent>
                        {grainSizeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select value={formData.color} onValueChange={(v) => updateField('color', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {colorOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Weathering</Label>
                      <Select value={formData.weathering} onValueChange={(v) => updateField('weathering', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weathering grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {weatheringOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Section 3: Mineralization and Alteration */}
        <Card>
          <SectionHeader title="Mineralization & Alteration" section="mineralization" icon={Plus} />
          <AnimatePresence>
            {expandedSections.has('mineralization') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mineralization</Label>
                      <Select value={formData.mineralization} onValueChange={(v) => updateField('mineralization', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mineralization" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {mineralizationOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Alteration Type</Label>
                      <Select value={formData.alterationType} onValueChange={(v) => updateField('alterationType', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alteration type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {alterationTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Alteration Intensity</Label>
                      <span className="text-sm font-medium text-primary">{formData.alterationIntensity}</span>
                    </div>
                    <Slider
                      value={[formData.alterationIntensity]}
                      onValueChange={([v]) => updateField('alterationIntensity', v)}
                      min={0}
                      max={5}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>None (0)</span>
                      <span>Pervasive (5)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Hardness (Mohs Scale)</Label>
                      <span className="text-sm font-medium text-primary">{formData.hardness}</span>
                    </div>
                    <Slider
                      value={[formData.hardness]}
                      onValueChange={([v]) => updateField('hardness', v)}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Talc (1)</span>
                      <span>Diamond (10)</span>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Section 4: Structural Measurements */}
        <Card>
          <SectionHeader title="Structural Measurements" section="structural" icon={MapPin} />
          <AnimatePresence>
            {expandedSections.has('structural') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label>Structural Feature</Label>
                    <Select value={formData.structuralFeature} onValueChange={(v) => updateField('structuralFeature', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feature" />
                      </SelectTrigger>
                      <SelectContent>
                        {structuralFeatureOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="strike">Strike (0-360)</Label>
                      <Input
                        id="strike"
                        type="number"
                        min={0}
                        max={360}
                        placeholder="0-360"
                        value={formData.strike ?? ''}
                        onChange={(e) => handleStrikeChange(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dip">Dip (0-90)</Label>
                      <Input
                        id="dip"
                        type="number"
                        min={0}
                        max={90}
                        placeholder="0-90"
                        value={formData.dip ?? ''}
                        onChange={(e) => updateField('dip', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dip Direction</Label>
                      <Input
                        readOnly
                        value={formData.dipDirection || 'Auto-calculated'}
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="structuralNotes">Structural Notes</Label>
                    <Textarea
                      id="structuralNotes"
                      placeholder="Additional structural observations..."
                      rows={2}
                      value={formData.structuralNotes}
                      onChange={(e) => updateField('structuralNotes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Section 5: Photos */}
        <Card>
          <SectionHeader title="Photos" section="photos" icon={Camera} />
          <AnimatePresence>
            {expandedSections.has('photos') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Drop images here or click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">Maximum file size: 10MB</p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={photo} alt={`Sample photo ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => updateField('photos', formData.photos.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Section 6: Field Notes with Voice Recording */}
        <Card>
          <SectionHeader title="Field Notes" section="notes" icon={Mic} />
          <AnimatePresence>
            {expandedSections.has('notes') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-0 space-y-6">
                  {/* Text notes */}
                  <div className="space-y-2">
                    <Label>Written Notes</Label>
                    <Textarea
                      placeholder="Detailed field observations, geological descriptions, and notes..."
                      rows={6}
                      value={formData.fieldNotes}
                      onChange={(e) => updateField('fieldNotes', e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  {/* Voice recording section */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Voice Recordings
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Record audio notes directly from your microphone
                    </p>
                    <VoiceRecorder
                      recordings={formData.voiceRecordings}
                      onAddRecording={handleAddVoiceRecording}
                      onDeleteRecording={handleDeleteVoiceRecording}
                    />
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Sample
        </Button>
      </div>
    </div>
  )
}
