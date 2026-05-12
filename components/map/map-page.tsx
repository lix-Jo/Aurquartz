'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Maximize2, Locate, Satellite } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import type { Sample } from '@/lib/types'
import L from 'leaflet'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

const useMap = dynamic(
  //() => import('react-leaflet').then((mod) => mod.useMap),
  { ssr: false }
) as unknown as () => ReturnType<typeof import('react-leaflet').useMap>

// Color legend for geological features
const geologicalLegend = [
  { color: '#E57373', label: 'Igneous Rocks' },
  { color: '#FFB74D', label: 'Sedimentary Rocks' },
  { color: '#81C784', label: 'Metamorphic Rocks' },
  { color: '#64B5F6', label: 'Hybrid / Special' },
]

// Custom marker icons
const createCustomIcon = (color: string) => {
  if (typeof window === 'undefined') return undefined
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

const createUserIcon = () => {
  if (typeof window === 'undefined') return undefined
  return L.divIcon({
    className: 'user-marker',
    html: `<div style="
      background-color: #3B82F6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 0 0 2px #3B82F6, 0 2px 8px rgba(59,130,246,0.5);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
    </style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  })
}

// Map Controller Component
function MapController({ 
  userLocation, 
  onLocate 
}: { 
  userLocation: [number, number] | null
  onLocate: () => void
}) {
  return null
}

export function MapPage() {
  const { projects } = useApp()
  const [isClient, setIsClient] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [userAccuracy, setUserAccuracy] = useState<number>(0)
  const [isLocating, setIsLocating] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Start watching user location
    if (navigator.geolocation) {
      setIsLocating(true)
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude])
          setUserAccuracy(pos.coords.accuracy)
          setIsLocating(false)
        },
        (error) => {
          console.error('[v0] Geolocation error:', error)
          setIsLocating(false)
          // Default to center of US if location not available
          setUserLocation([39.8283, -98.5795])
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
      setWatchId(id)
    }

    // Cleanup on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  // Collect all samples with valid coordinates
  const allSamples = useMemo(() => {
    const samples: (Sample & { projectName: string })[] = []
    projects.forEach(project => {
      project.samples.forEach(sample => {
        if (sample.coordinates.latitude && sample.coordinates.longitude) {
          samples.push({ ...sample, projectName: project.name })
        }
      })
    })
    return samples
  }, [projects])

  // Calculate map center based on samples or user location
  const mapCenter = useMemo<[number, number]>(() => {
    if (allSamples.length > 0) {
      const avgLat = allSamples.reduce((sum, s) => sum + (s.coordinates.latitude || 0), 0) / allSamples.length
      const avgLng = allSamples.reduce((sum, s) => sum + (s.coordinates.longitude || 0), 0) / allSamples.length
      return [avgLat, avgLng]
    }
    return userLocation || [39.8283, -98.5795]
  }, [allSamples, userLocation])

  const getMarkerColor = (rockCategory: string): string => {
    if (rockCategory?.includes('Igneous')) return '#E57373'
    if (rockCategory?.includes('Sedimentary')) return '#FFB74D'
    if (rockCategory?.includes('Metamorphic')) return '#81C784'
    return '#64B5F6'
  }

  const handleLocateUser = useCallback(() => {
    if (userLocation && mapInstance) {
      mapInstance.setView(userLocation, 15, { animate: true })
    } else if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setUserLocation(loc)
          setUserAccuracy(pos.coords.accuracy)
          setIsLocating(false)
          if (mapInstance) {
            mapInstance.setView(loc, 15, { animate: true })
          }
        },
        () => setIsLocating(false)
      )
    }
  }, [userLocation, mapInstance])

  const handleZoomIn = useCallback(() => {
    mapInstance?.zoomIn()
  }, [mapInstance])

  const handleZoomOut = useCallback(() => {
    mapInstance?.zoomOut()
  }, [mapInstance])

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Field Map</h1>
          <p className="text-muted-foreground mt-1">View all sample locations on the map</p>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Map skeleton */}
        <Card className="overflow-hidden">
          <div className="relative h-[500px] md:h-[600px]">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                  <Satellite className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground">Loading satellite map...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Field Map</h1>
          <p className="text-muted-foreground mt-1">
            {allSamples.length} sample{allSamples.length !== 1 ? 's' : ''} plotted from {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Satellite className="w-4 h-4" />
            Satellite View
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{allSamples.length}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {geologicalLegend.slice(0, 3).map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {allSamples.filter(s => 
                      item.label.includes('Igneous') ? s.rockCategory?.includes('Igneous') :
                      item.label.includes('Sedimentary') ? s.rockCategory?.includes('Sedimentary') :
                      s.rockCategory?.includes('Metamorphic')
                    ).length}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label.split(' ')[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map */}
      <Card className="overflow-hidden">
        <div className="relative h-[500px] md:h-[600px]">
          <MapContainer
            center={mapCenter}
            zoom={allSamples.length > 0 ? 6 : 4}
            className="h-full w-full"
            style={{ background: '#1a1a2e' }}
            ref={(map) => setMapInstance(map as unknown as L.Map)}
          >
            {/* Satellite Tile Layer - ESRI World Imagery */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> | World Imagery'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            {/* Labels overlay */}
            <TileLayer
              attribution=''
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />
            
            {/* Sample Markers */}
            {allSamples.map((sample) => (
              <Marker
                key={sample.id}
                position={[sample.coordinates.latitude!, sample.coordinates.longitude!]}
                icon={createCustomIcon(getMarkerColor(sample.rockCategory))}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-semibold text-foreground mb-1">
                      {sample.sampleNumber} - {sample.sampleName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{sample.projectName}</p>
                    <div className="space-y-1 text-xs">
                      <p><span className="font-medium">Rock:</span> {sample.rockName || 'Unknown'}</p>
                      <p><span className="font-medium">Type:</span> {sample.rockCategory || 'Unknown'}</p>
                      <p className="font-mono">
                        <span className="font-medium font-sans">Coords:</span> {sample.coordinates.latitude?.toFixed(4)}, {sample.coordinates.longitude?.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User Location Marker with accuracy circle */}
            {userLocation && (
              <>
                <Circle
                  center={userLocation}
                  radius={userAccuracy}
                  pathOptions={{
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.1,
                    weight: 1
                  }}
                />
                <Marker 
                  position={userLocation}
                  icon={createUserIcon()}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-semibold">Your Location</p>
                      <p className="text-xs text-muted-foreground">
                        {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                      </p>
                      {userAccuracy && (
                        <p className="text-xs text-muted-foreground">
                          Accuracy: ~{Math.round(userAccuracy)}m
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="shadow-lg bg-background/90 backdrop-blur-sm"
              onClick={handleZoomIn}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="shadow-lg bg-background/90 backdrop-blur-sm"
              onClick={handleZoomOut}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className={`shadow-lg bg-background/90 backdrop-blur-sm ${isLocating ? 'animate-pulse' : ''}`}
              onClick={handleLocateUser}
              disabled={isLocating}
            >
              <Locate className="w-4 h-4" />
            </Button>
          </div>

          {/* User location indicator */}
          {userLocation && (
            <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium">Live Location Active</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Geological Color Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            {geologicalLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
              <span className="text-sm text-muted-foreground">Your Location</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Samples List */}
      {allSamples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sample Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {allSamples.map((sample) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMarkerColor(sample.rockCategory) }}
                    />
                    <div>
                      <p className="font-medium text-sm">{sample.sampleNumber} - {sample.sampleName}</p>
                      <p className="text-xs text-muted-foreground">{sample.projectName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground">
                      {sample.coordinates.latitude?.toFixed(4)}, {sample.coordinates.longitude?.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground">{sample.rockName || 'Unknown rock'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
