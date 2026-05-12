'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Award, 
  FolderKanban, 
  Layers, 
  Calendar,
  LogOut,
  Pencil,
  Save,
  X,
  Activity,
  Camera,
  Upload,
  Check
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import type { ExperienceLevel } from '@/lib/types'
import { useRouter } from 'next/navigation'

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  student: 'Student',
  researcher: 'Researcher',
  geologist: 'Geologist',
  professor: 'Professor',
  practitioner: 'Practitioner'
}

const experienceLevelDescriptions: Record<ExperienceLevel, string> = {
  student: 'Currently studying geology or related field',
  researcher: 'Academic or industry research focus',
  geologist: 'Professional field geologist',
  professor: 'Academic teaching position',
  practitioner: 'Industry practitioner or consultant'
}

export function ProfilePage() {
  const router = useRouter()
  const { user, projects, logout, updateUser, saveStatus, isHydrated } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    experienceLevel: user?.experienceLevel || 'student' as ExperienceLevel,
    profileImage: user?.profileImage || null as string | null
  })

  // Update edit data when user changes
  useState(() => {
    if (user) {
      setEditData({
        fullName: user.fullName || user.email.split('@')[0],
        email: user.email,
        experienceLevel: user.experienceLevel,
        profileImage: user.profileImage
      })
    }
  })

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setEditData(prev => ({ ...prev, profileImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    updateUser({
      fullName: editData.fullName,
      experienceLevel: editData.experienceLevel,
      profileImage: editData.profileImage
    })
    
    setIsSaving(false)
    setIsEditing(false)
  }, [editData, updateUser])

  const handleCancel = useCallback(() => {
    // Reset to current user data
    if (user) {
      setEditData({
        fullName: user.fullName || user.email.split('@')[0],
        email: user.email,
        experienceLevel: user.experienceLevel,
        profileImage: user.profileImage
      })
    }
    setIsEditing(false)
  }, [user])

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-48 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalSamples = projects.reduce((acc, p) => acc + p.samples.length, 0)
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getInitials = (name: string, email: string) => {
    if (name && name.length >= 2) {
      return name.slice(0, 2).toUpperCase()
    }
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  const displayName = user.fullName || user.email.split('@')[0]

  return (
    <div className="space-y-6">
      {/* Header with save status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and view activity
          </p>
        </div>
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm">Saving...</span>
          </div>
        )}
        {saveStatus === 'saved' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-600"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm">All changes saved</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  {(isEditing ? editData.profileImage : user.profileImage) ? (
                    <AvatarImage 
                      src={isEditing ? editData.profileImage! : user.profileImage!} 
                      alt={displayName} 
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(displayName, user.email)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              {isEditing ? (
                <div className="w-full space-y-4">
                  {/* Image upload hint */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-primary hover:underline"
                    >
                      <Upload className="w-4 h-4 inline mr-1" />
                      Upload new photo
                    </button>
                    {editData.profileImage && (
                      <button
                        type="button"
                        onClick={() => setEditData(prev => ({ ...prev, profileImage: null }))}
                        className="text-sm text-destructive hover:underline ml-3"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editData.fullName}
                      onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <Label htmlFor="level">Experience Level</Label>
                    <Select
                      value={editData.experienceLevel}
                      onValueChange={(v) => setEditData(prev => ({ ...prev, experienceLevel: v as ExperienceLevel }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(experienceLevelLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div>
                              <p className="font-medium">{label}</p>
                              <p className="text-xs text-muted-foreground">
                                {experienceLevelDescriptions[value as ExperienceLevel]}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{experienceLevelLabels[user.experienceLevel]}</span>
                    {user.isGuest && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Guest</span>
                    )}
                  </div>

                  <div className="w-full space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => {
                      setEditData({
                        fullName: user.fullName || user.email.split('@')[0],
                        email: user.email,
                        experienceLevel: user.experienceLevel,
                        profileImage: user.profileImage
                      })
                      setIsEditing(true)
                    }}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{projects.length}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalSamples}</p>
                    <p className="text-xs text-muted-foreground">Samples</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {projects.length > 0 
                        ? Math.ceil((new Date().getTime() - new Date(projects[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
                        : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your latest projects and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <FolderKanban className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.samples.length} samples - {project.location || 'No location'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          project.status === 'active' 
                            ? 'bg-green-500/10 text-green-600'
                            : project.status === 'complete'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email</span>
                  </div>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Full Name</span>
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Experience Level</span>
                  </div>
                  <span className="text-sm font-medium">{experienceLevelLabels[user.experienceLevel]}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Account Type</span>
                  </div>
                  <span className="text-sm font-medium">{user.isGuest ? 'Guest' : 'Registered'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
