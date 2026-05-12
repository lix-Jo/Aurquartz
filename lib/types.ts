// User types
export interface User {
  email: string
  fullName: string
  experienceLevel: ExperienceLevel
  isGuest: boolean
  profileImage: string | null
}

// Voice Recording type
export interface VoiceRecording {
  id: string
  audioUrl: string
  duration: number
  createdAt: string
}

export type ExperienceLevel = 'student' | 'researcher' | 'geologist' | 'professor' | 'practitioner'

export type AuthMode = 'login' | 'register' | 'guest'

// Project types
export interface Project {
  id: string
  name: string
  location: string
  date: string
  status: ProjectStatus
  description: string
  samples: Sample[]
  createdAt: string
}

export type ProjectStatus = 'active' | 'draft' | 'complete'

// Sample types
export interface Sample {
  id: string
  projectId: string
  sampleNumber: string
  sampleName: string
  coordinates: Coordinates
  // Geological data
  rockCategory: string
  rockSubcategory: string
  rockName: string
  rockType: string
  grainSize: string
  color: string
  weathering: string
  // Mineralization and Alteration
  mineralization: string
  alterationType: string
  alterationIntensity: number
  hardness: number
  // Structural measurements
  structuralFeature: string
  strike: number | null
  dip: number | null
  dipDirection: string
  structuralNotes: string
  // Photos
  photos: string[]
  // Field notes
  fieldNotes: string
  // Voice recordings
  voiceRecordings: VoiceRecording[]
  createdAt: string
}

export interface Coordinates {
  latitude: number | null
  longitude: number | null
}

// Rock Database Types
export interface RockCategory {
  name: string
  subcategories: RockSubcategory[]
}

export interface RockSubcategory {
  name: string
  rocks: string[]
}

// Dropdown option types
export interface SelectOption {
  value: string
  label: string
}
