'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { User, Project, Sample, ExperienceLevel } from './types'
import { dummyProjects } from './dummy-data'

interface AppState {
  user: User | null
  projects: Project[]
  currentProject: Project | null
  isAuthenticated: boolean
  theme: 'light' | 'dark'
  isHydrated: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, experienceLevel: ExperienceLevel) => Promise<boolean>
  loginAsGuest: () => void
  logout: () => void
  createProject: (project: Omit<Project, 'id' | 'samples' | 'createdAt'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  addSample: (projectId: string, sample: Omit<Sample, 'id' | 'projectId' | 'createdAt'>) => Sample
  updateSample: (projectId: string, sampleId: string, updates: Partial<Sample>) => void
  deleteSample: (projectId: string, sampleId: string) => void
  toggleTheme: () => void
  updateUser: (updates: Partial<User>) => void
  saveDraftForm: (formId: string, data: Record<string, unknown>) => void
  getDraftForm: (formId: string) => Record<string, unknown> | null
  clearDraftForm: (formId: string) => void
}

const STORAGE_KEY = 'aurquartz-app-state'
const DRAFT_STORAGE_KEY = 'aurquartz-draft-forms'

const AppContext = createContext<AppContextType | undefined>(undefined)

// Helper to safely access localStorage
function getStoredState(): Partial<AppState> | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('[v0] Error reading from localStorage:', e)
  }
  return null
}

function saveState(state: Partial<AppState>) {
  if (typeof window === 'undefined') return
  try {
    const toStore = {
      user: state.user,
      projects: state.projects,
      isAuthenticated: state.isAuthenticated,
      theme: state.theme
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } catch (e) {
    console.error('[v0] Error saving to localStorage:', e)
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    projects: dummyProjects,
    currentProject: null,
    isAuthenticated: false,
    theme: 'light',
    isHydrated: false,
    saveStatus: 'idle'
  })

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Hydrate state from localStorage on mount
  useEffect(() => {
    const stored = getStoredState()
    if (stored) {
      setState(prev => ({
        ...prev,
        user: stored.user ?? prev.user,
        projects: stored.projects ?? prev.projects,
        isAuthenticated: stored.isAuthenticated ?? prev.isAuthenticated,
        theme: stored.theme ?? prev.theme,
        isHydrated: true
      }))
      
      // Apply theme on hydration
      if (stored.theme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    } else {
      setState(prev => ({ ...prev, isHydrated: true }))
    }
  }, [])

  // Auto-save state changes with debouncing
  useEffect(() => {
    if (!state.isHydrated) return

    setState(prev => ({ ...prev, saveStatus: 'saving' }))
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveState(state)
      setState(prev => ({ ...prev, saveStatus: 'saved' }))
      
      // Reset to idle after a moment
      setTimeout(() => {
        setState(prev => ({ ...prev, saveStatus: 'idle' }))
      }, 2000)
    }, 500)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state.user, state.projects, state.isAuthenticated, state.theme, state.isHydrated])

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setState(prev => ({
      ...prev,
      user: { 
        email, 
        fullName: email.split('@')[0], 
        experienceLevel: 'geologist', 
        isGuest: false,
        profileImage: null 
      },
      isAuthenticated: true
    }))
    return true
  }, [])

  const register = useCallback(async (email: string, _password: string, experienceLevel: ExperienceLevel): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setState(prev => ({
      ...prev,
      user: { 
        email, 
        fullName: email.split('@')[0],
        experienceLevel, 
        isGuest: false,
        profileImage: null 
      },
      isAuthenticated: true
    }))
    return true
  }, [])

  const loginAsGuest = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: { 
        email: 'guest@aurquartz.app', 
        fullName: 'Guest User',
        experienceLevel: 'student', 
        isGuest: true,
        profileImage: null 
      },
      isAuthenticated: true
    }))
  }, [])

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      currentProject: null
    }))
    // Clear stored state on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : prev.user
    }))
  }, [])

  const createProject = useCallback((projectData: Omit<Project, 'id' | 'samples' | 'createdAt'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      samples: [],
      createdAt: new Date().toISOString()
    }
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      currentProject: newProject
    }))
    return newProject
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
      currentProject: prev.currentProject?.id === id ? { ...prev.currentProject, ...updates } : prev.currentProject
    }))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      currentProject: prev.currentProject?.id === id ? null : prev.currentProject
    }))
  }, [])

  const setCurrentProject = useCallback((project: Project | null) => {
    setState(prev => ({ ...prev, currentProject: project }))
  }, [])

  const addSample = useCallback((projectId: string, sampleData: Omit<Sample, 'id' | 'projectId' | 'createdAt'>): Sample => {
    const newSample: Sample = {
      ...sampleData,
      id: `sample-${Date.now()}`,
      projectId,
      createdAt: new Date().toISOString()
    }
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, samples: [...p.samples, newSample] }
          : p
      ),
      currentProject: prev.currentProject?.id === projectId 
        ? { ...prev.currentProject, samples: [...prev.currentProject.samples, newSample] }
        : prev.currentProject
    }))
    return newSample
  }, [])

  const updateSample = useCallback((projectId: string, sampleId: string, updates: Partial<Sample>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, samples: p.samples.map(s => s.id === sampleId ? { ...s, ...updates } : s) }
          : p
      ),
      currentProject: prev.currentProject?.id === projectId 
        ? { ...prev.currentProject, samples: prev.currentProject.samples.map(s => s.id === sampleId ? { ...s, ...updates } : s) }
        : prev.currentProject
    }))
  }, [])

  const deleteSample = useCallback((projectId: string, sampleId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, samples: p.samples.filter(s => s.id !== sampleId) }
          : p
      ),
      currentProject: prev.currentProject?.id === projectId 
        ? { ...prev.currentProject, samples: prev.currentProject.samples.filter(s => s.id !== sampleId) }
        : prev.currentProject
    }))
  }, [])

  const toggleTheme = useCallback(() => {
    setState(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light'
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      }
      return { ...prev, theme: newTheme }
    })
  }, [])

  // Draft form management for auto-save
  const saveDraftForm = useCallback((formId: string, data: Record<string, unknown>) => {
    if (typeof window === 'undefined') return
    try {
      const drafts = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}')
      drafts[formId] = { data, timestamp: Date.now() }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
    } catch (e) {
      console.error('[v0] Error saving draft:', e)
    }
  }, [])

  const getDraftForm = useCallback((formId: string): Record<string, unknown> | null => {
    if (typeof window === 'undefined') return null
    try {
      const drafts = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}')
      return drafts[formId]?.data || null
    } catch (e) {
      console.error('[v0] Error reading draft:', e)
      return null
    }
  }, [])

  const clearDraftForm = useCallback((formId: string) => {
    if (typeof window === 'undefined') return
    try {
      const drafts = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}')
      delete drafts[formId]
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
    } catch (e) {
      console.error('[v0] Error clearing draft:', e)
    }
  }, [])

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      register,
      loginAsGuest,
      logout,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject,
      addSample,
      updateSample,
      deleteSample,
      toggleTheme,
      updateUser,
      saveDraftForm,
      getDraftForm,
      clearDraftForm
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
