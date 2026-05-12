'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

// --- Interfaces ---
interface FieldGuide {
  id: string
  title: string
  description: string
  imageUrl: string
}

// --- Data ---
const fieldGuides: FieldGuide[] = [
  {
    id: 'mineralization-indicators',
    title: 'Mineralization Indicators Field Guide',
    description: 'Comprehensive guide covering alteration types, veins, oxides, sulfides, structures, and color anomalies observed during field exploration.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wIwLDQkWDYo81yGZDO3AN6FbHDbqto.png'
  },
  {
    id: 'alteration-types',
    title: 'Alteration Types Field Guide',
    description: 'Detailed reference for 12 common alteration styles including potassic, phyllic, argillic, propylitic, silicification, and more - used in geological mapping and mineral exploration.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wsWlXrWhT4MmdQVxG0L6pOM0k1dDrS.png'
  },
  {
    id: 'map-symbols-guide',
    title: 'Geological Map Symbols Guide',
    description: 'Standard symbols used in geological mapping including strike & dip, faults, anticlines, synclines, sample points, igneous contacts, and thrust/normal faults.',
    imageUrl: 'https://i.postimg.cc/1XtGHftd/Whats-App-Image-2026-05-12-at-16-52-37.jpg'
  },
  {
    id: 'sample-description-field',
    title: 'Geological sample Description Field Guide',
    description: 'Represents a general location where a hand specimen was collected for lithological (rock type) description or reference.',
    imageUrl: 'https://i.postimg.cc/BbqpKFhX/sample-description-field-guide-high-quality.png'
  },
  {
    id: 'silva-compass-field-guide',
    title: 'Geological compass use Field Guide',
    description: 'The Silva Compass Field Guide covers essential navigation: reading maps, adjusting declination, and measuring geological strike and dip for field mapping.',
    imageUrl: 'https://i.postimg.cc/g0x2GBm8/silva-compass-field-guide-credits-final-(1).png'
  },
   {
    id: 'STRUCTURAL CLASSIFICATION IN THE FIELD',
    title: 'STRUCTURAL CLASSIFICATION IN THE FIELD',
    description:'',
    imageUrl: 'https://i.postimg.cc/7hGCh7bY/structural-classification-field-guide-HQ.png'
  },
 {
    id: 'Bowen’s-Reaction-Series',
    title: 'Bowen’s Reaction Series',
    description:'',
    imageUrl: 'https://i.postimg.cc/dtv8VNwv/geology-charts-high-resolution-swr-0.jpg'
  },
   {
    id: 'Geologic-Time-Scale',
    title: 'Geologic Time Scale',
    description:'',
    imageUrl: 'https://i.postimg.cc/SNvCfScn/geology-charts-high-resolution-swr-1.jpg'
  },
   {
    id: 'Igneous-Rocks-Classification',
    title: 'Igneous Rocks Classification',
    description:'',
    imageUrl: 'https://i.postimg.cc/X7dBdfNC/geology-charts-high-resolution-swr-2.jpg'
  },
     {
    id: 'Metamorphic-Rocks-Classification',
    title: 'Metamorphic Rocks Classification',
    description:'',
    imageUrl: 'https://i.postimg.cc/MpRkWGDK/geology-charts-high-resolution-swr-3-(1).jpg'
  },
  {
    id: 'Rock-Cycle',
    title: 'Rock Cycle',
    description:'',
    imageUrl: 'https://i.postimg.cc/QM93Kbhd/geology-charts-high-resolution-swr-4.jpg'
  },
    {
    id: 'Sedimentary-Rocks-Identification',
    title: 'Sedimentary Rocks Identification',
    description:'',
    imageUrl: 'https://i.postimg.cc/NFbVz9Qg/geology-charts-high-resolution-swr-5.jpg'
  },
]

// --- Component ---
export function GuidancePage() {
  const [selectedGuide, setSelectedGuide] = useState<FieldGuide | null>(null)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Field Guidance</h1>
        <p className="text-muted-foreground mt-1">
          Reference materials and best practices for geological fieldwork
        </p>
      </div>

      {/* Visual Reference Guides Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Visual Reference Guides</h2>
          <p className="text-sm text-muted-foreground">
            Click on any guide to view in full size
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fieldGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 overflow-hidden"
                onClick={() => setSelectedGuide(guide)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={guide.imageUrl}
                    alt={guide.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium">Click to enlarge</p>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {guide.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Field Guide Image Modal */}
      <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedGuide && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGuide.title}</DialogTitle>
                <DialogDescription>{selectedGuide.description}</DialogDescription>
              </DialogHeader>
              <div className="relative w-full mt-4">
                <Image
                  src={selectedGuide.imageUrl}
                  alt={selectedGuide.title}
                  width={1200}
                  height={1600}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}