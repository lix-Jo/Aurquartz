'use client'

import { MapPage } from '@/components/map/map-page'
import dynamic from 'next/dynamic'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

export default function MapRoute() {
  return <MapPage />
}
