'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Table2,
  FileSpreadsheet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApp } from '@/lib/store'
import type { Sample, Project } from '@/lib/types'

interface FlatSample extends Sample {
  projectName: string
  projectLocation: string
  projectStatus: string
}

type SortField = 'sampleNumber' | 'sampleName' | 'projectName' | 'rockName' | 'createdAt'
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 10

export function DataTablePage() {
  const { projects } = useApp()
  const [search, setSearch] = useState('')
  const [filterProject, setFilterProject] = useState<string>('all')
  const [filterRockCategory, setFilterRockCategory] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Flatten all samples with project info
  const allSamples: FlatSample[] = useMemo(() => {
    return projects.flatMap(project => 
      project.samples.map(sample => ({
        ...sample,
        projectName: project.name,
        projectLocation: project.location,
        projectStatus: project.status
      }))
    )
  }, [projects])

  // Get unique rock categories for filter
  const rockCategories = useMemo(() => {
    const categories = new Set<string>()
    allSamples.forEach(s => {
      if (s.rockCategory) categories.add(s.rockCategory)
    })
    return Array.from(categories)
  }, [allSamples])

  // Filter and sort samples
  const filteredSamples = useMemo(() => {
    let result = [...allSamples]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(s => 
        s.sampleNumber.toLowerCase().includes(searchLower) ||
        s.sampleName.toLowerCase().includes(searchLower) ||
        s.projectName.toLowerCase().includes(searchLower) ||
        s.rockName?.toLowerCase().includes(searchLower) ||
        s.fieldNotes?.toLowerCase().includes(searchLower)
      )
    }

    // Project filter
    if (filterProject !== 'all') {
      result = result.filter(s => s.projectId === filterProject)
    }

    // Rock category filter
    if (filterRockCategory !== 'all') {
      result = result.filter(s => s.rockCategory === filterRockCategory)
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortField) {
        case 'sampleNumber':
          aVal = a.sampleNumber
          bVal = b.sampleNumber
          break
        case 'sampleName':
          aVal = a.sampleName
          bVal = b.sampleName
          break
        case 'projectName':
          aVal = a.projectName
          bVal = b.projectName
          break
        case 'rockName':
          aVal = a.rockName || ''
          bVal = b.rockName || ''
          break
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

    return result
  }, [allSamples, search, filterProject, filterRockCategory, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredSamples.length / ITEMS_PER_PAGE)
  const paginatedSamples = filteredSamples.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-4 h-4 opacity-50" />
      )}
    </button>
  )

  const exportToCSV = () => {
    const headers = [
      'Sample Number',
      'Sample Name',
      'Project',
      'Location',
      'Latitude',
      'Longitude',
      'Rock Category',
      'Rock Name',
      'Color',
      'Weathering',
      'Mineralization',
      'Alteration Type',
      'Alteration Intensity',
      'Hardness',
      'Structural Feature',
      'Strike',
      'Dip',
      'Dip Direction',
      'Field Notes',
      'Date'
    ]

    const rows = filteredSamples.map(s => [
      s.sampleNumber,
      s.sampleName,
      s.projectName,
      s.projectLocation,
      s.coordinates.latitude,
      s.coordinates.longitude,
      s.rockCategory,
      s.rockName,
      s.color,
      s.weathering,
      s.mineralization,
      s.alterationType,
      s.alterationIntensity,
      s.hardness,
      s.structuralFeature,
      s.strike,
      s.dip,
      s.dipDirection,
      s.fieldNotes?.replace(/"/g, '""'),
      new Date(s.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell ?? ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `aurquartz_samples_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Table</h1>
          <p className="text-muted-foreground mt-1">
            View and export all geological sample data
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Table2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{allSamples.length}</p>
                <p className="text-xs text-muted-foreground">Total Samples</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{projects.length}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Filter className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{filteredSamples.length}</p>
                <p className="text-xs text-muted-foreground">Filtered Results</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{rockCategories.length}</p>
                <p className="text-xs text-muted-foreground">Rock Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search samples, projects, rocks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select 
              value={filterProject} 
              onValueChange={(v) => {
                setFilterProject(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={filterRockCategory} 
              onValueChange={(v) => {
                setFilterRockCategory(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Rock Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rock Types</SelectItem>
                {rockCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredSamples.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Table2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No samples found</p>
              {search && (
                <Button variant="link" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">
                          <SortButton field="sampleNumber">Sample #</SortButton>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <SortButton field="sampleName">Name</SortButton>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <SortButton field="projectName">Project</SortButton>
                        </TableHead>
                        <TableHead className="font-semibold">Coordinates</TableHead>
                        <TableHead className="font-semibold">
                          <SortButton field="rockName">Rock</SortButton>
                        </TableHead>
                        <TableHead className="font-semibold">Mineralization</TableHead>
                        <TableHead className="font-semibold">Structure</TableHead>
                        <TableHead className="font-semibold">
                          <SortButton field="createdAt">Date</SortButton>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSamples.map((sample, index) => (
                        <motion.tr
                          key={sample.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-mono text-primary font-medium">
                            {sample.sampleNumber}
                          </TableCell>
                          <TableCell className="font-medium">{sample.sampleName}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sample.projectName}</p>
                              <p className="text-xs text-muted-foreground">{sample.projectLocation}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {sample.coordinates.latitude && sample.coordinates.longitude
                              ? `${sample.coordinates.latitude.toFixed(4)}, ${sample.coordinates.longitude.toFixed(4)}`
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sample.rockName || '-'}</p>
                              <p className="text-xs text-muted-foreground">{sample.rockCategory || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {sample.mineralization && sample.mineralization !== 'none' ? (
                              <Badge variant="secondary" className="text-xs">
                                {sample.mineralization.split('-').join(' ')}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {sample.structuralFeature ? (
                              <div className="text-xs">
                                <p className="font-medium capitalize">{sample.structuralFeature}</p>
                                {sample.strike !== null && (
                                  <p className="text-muted-foreground">
                                    {sample.strike}/{sample.dip} {sample.dipDirection}
                                  </p>
                                )}
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(sample.createdAt).toLocaleDateString()}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSamples.length)} of {filteredSamples.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page: number
                        if (totalPages <= 5) {
                          page = i + 1
                        } else if (currentPage <= 3) {
                          page = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i
                        } else {
                          page = currentPage - 2 + i
                        }
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8"
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
