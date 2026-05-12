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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

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

import type {
  Sample,
  Coordinates,
  VoiceRecording
} from '@/lib/types'

interface SampleFormProps {
  projectId: string
  existingSample?: Sample
  onCancel?: () => void
}

type SectionKey =
  | 'basic'
  | 'geological'
  | 'mineralization'
  | 'structural'
  | 'photos'
  | 'notes'

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
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm'
        })

        const audioUrl = URL.createObjectURL(audioBlob)

        const newRecording: VoiceRecording = {
          id: `rec-${Date.now()}`,
          audioUrl,
          duration: recordingTime,
          createdAt: new Date().toISOString()
        }

        onAddRecording(newRecording)

        setRecordingTime(0)

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()

      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {

      console.error(error)

      alert('Unable to access microphone')
    }
  }

  const stopRecording = () => {

    if (mediaRecorderRef.current && isRecording) {

      mediaRecorderRef.current.stop()

      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
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

      audioRef.current.onended = () => {
        setPlayingId(null)
      }

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

      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">

        {!isRecording ? (

          <Button
            type="button"
            onClick={startRecording}
            className="gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </Button>

        ) : (

          <>
            <Button
              type="button"
              variant="destructive"
              onClick={stopRecording}
              className="gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

              <span className="font-mono text-sm">
                {formatTime(recordingTime)}
              </span>
            </div>
          </>
        )}
      </div>

      {recordings.length > 0 && (

        <div className="space-y-2">

          <p className="text-sm font-medium text-muted-foreground">
            Saved Recordings
          </p>

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
                  className="text-destructive"
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

export function SampleForm({
  projectId,
  existingSample,
  onCancel
}: SampleFormProps) {

  const router = useRouter()

  const {
    addSample,
    updateSample,
    currentProject,
    saveDraftForm,
    getDraftForm,
    clearDraftForm,
    saveStatus
  } = useApp()

  const draftKey = `sample-form-${projectId}-${existingSample?.id || 'new'}`

  const nextSampleNumber = existingSample
    ? existingSample.sampleNumber
    : String((currentProject?.samples?.length || 0) + 1)

  const generatedSampleName =
    `${(currentProject?.name || 'sample')
      .replace(/\s+/g, '')
      .toLowerCase()}${nextSampleNumber}`

  const [expandedSections, setExpandedSections] =
    useState<Set<SectionKey>>(
      new Set(['basic', 'geological'])
    )
