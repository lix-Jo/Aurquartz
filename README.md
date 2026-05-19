# Aurquartz 🪨

> A next-generation geological fieldwork and exploration platform designed for geologists, Earth Science students, mineral exploration teams, and geological mapping projects. 🌍

---

## 🌐 Live Demo

Experience the live demo version of Aurquartz here:

🔗 https://aurquartz-frha.vercel.app/

---

## 🏆 Achievement

Aurquartz achieved **1st Place** at the Earth Sciences College Hackathon 🥇  
The project was recognized for combining geological field workflows with scalable modern software architecture.

---

## 📸 Preview

Aurquartz provides a modern geological fieldwork workflow including:

- 🛰️ GPS-based sample recording
- 🪨 Geological sample management
- 📍 Interactive mapping
- 📷 Geological photo documentation
- ⛏️ Mineralization & alteration logging
- 📊 CSV / KML / PDF export
- 📡 Offline-first field operations

---

## Overview

Aurquartz is a modern geological field data management platform built to replace fragmented traditional field workflows with a unified digital ecosystem.

Instead of using:

* Physical notebooks
* Camera galleries
* Separate GPS applications
* Spreadsheet files
* GIS exports
* Disconnected geological software

Aurquartz centralizes the entire geological field workflow into one integrated platform.

The platform is designed specifically for:

* Geological mapping
* Mineral exploration
* Field sampling
* Structural geology measurements
* Outcrop documentation
* Geological surveys
* University field trips
* Mining and exploration workflows

Aurquartz focuses on reliability, offline-first architecture, GIS compatibility, structured geological data collection, and scalable exploration workflows.

---

# 🌋 Core Vision

Aurquartz is not just a note-taking application.

It is designed as a scalable geological exploration infrastructure capable of evolving into a complete digital field ecosystem.

The platform combines:

* Geological field notebook
* GPS sample recorder
* Geological photo management
* Mineralization logging
* Alteration tracking
* Structural measurements
* Interactive geological mapping
* Data export pipelines
* Geological reference system
* Offline field database
* GIS-ready workflows

---

# Key Objectives

## 1. Centralized Geological Data

All geological field observations are linked under a unified project structure.

Each:

* Project
* Locality
* Sample
* Structural measurement
* Photo
* Geological observation

is relationally connected and queryable.

---

## 2. Offline-First Fieldwork

Field teams often work in remote environments with unstable or non-existent internet connectivity.

Aurquartz is designed with an offline-first architecture where:

* Data is stored locally first
* Internet connectivity is optional
* Synchronization occurs later
* No field data should ever be lost

---

## 3. GIS and Exploration Compatibility

Aurquartz exports structured geological data compatible with:

* QGIS
* ArcGIS Pro
* Leapfrog
* Google Earth
* Excel
* Exploration databases

Supported export formats:

* CSV
* KML
* PDF Reports
* Future GeoJSON support

---

## 4. Geological Workflow Optimization

The system is designed around real exploration workflows.

Core workflow:

```txt
Project
   ↓
Locality / Station
   ↓
Sample
   ↓
GPS Coordinates
   ↓
Photos
   ↓
Field Description
   ↓
Mineralization
   ↓
Alteration
   ↓
Structural Measurements
   ↓
Map Visualization
   ↓
Data Table
   ↓
CSV / KML / PDF Export
```

---

# 🏗️ System Architecture

# High-Level Architecture

```txt
┌─────────────────────────────────────┐
│            Frontend Layer           │
├─────────────────────────────────────┤
│ React / Next.js                     │
│ TailwindCSS                         │
│ React Query                         │
│ Zustand / Context API               │
│ React Hook Form                     │
│ Leaflet / React-Leaflet             │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│         Application Layer           │
├─────────────────────────────────────┤
│ Project Management                  │
│ Sample Management                   │
│ GPS Services                        │
│ Photo Processing                    │
│ Geological Validation               │
│ Export Engine                       │
│ Offline Sync Engine                 │
│ Geological Templates                │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│          Data Storage Layer         │
├─────────────────────────────────────┤
│ IndexedDB / SQLite                  │
│ Cloud Database                      │
│ File Storage                        │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│         External Integrations       │
├─────────────────────────────────────┤
│ GPS APIs                            │
│ GIS Workflows                       │
│ Future AI Services                  │
│ Future Cloud Sync                   │
└─────────────────────────────────────┘
```

---

# 💻 Frontend Architecture

Aurquartz uses a modular frontend architecture optimized for scalability and maintainability.

## Frontend Stack

```txt
Frontend Framework:
- React / Next.js

Styling:
- TailwindCSS

State Management:
- Zustand / Context API

Forms & Validation:
- React Hook Form
- Zod Validation

Mapping:
- Leaflet
- React-Leaflet

Data Fetching:
- React Query

Offline Storage:
- IndexedDB

PDF Generation:
- jsPDF / pdf-lib

CSV Export:
- PapaParse
```

---

## Frontend Module Structure

```txt
src/
├── app/
├── components/
│   ├── forms/
│   ├── maps/
│   ├── tables/
│   ├── exports/
│   ├── geological/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── projects/
│   ├── localities/
│   ├── samples/
│   ├── gps/
│   ├── photos/
│   ├── mineralization/
│   ├── alteration/
│   ├── structures/
│   ├── map/
│   ├── export/
│   ├── offline/
│   └── sync/
│
├── services/
├── hooks/
├── store/
├── utils/
├── types/
└── data/
```

---

# ⚙️ Backend Architecture

The backend is designed around a modular service-oriented architecture.

The main responsibility of the backend is to:

* Manage authentication
* Store geological records
* Handle synchronization
* Manage project relationships
* Process exports
* Handle future cloud collaboration
* Maintain data integrity

---

## Backend Stack

```txt
Runtime:
- Node.js

Framework:
- Express.js / Next.js API Routes

Database:
- PostgreSQL

ORM:
- Prisma ORM

Authentication:
- JWT Authentication
- Session Tokens

Storage:
- Local Storage / Cloud Object Storage

Validation:
- Zod

Caching:
- Redis (future)
```

---

## Backend Service Architecture

```txt
┌──────────────────────────┐
│      Authentication      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Project Service     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Sample Service      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    Geological Services   │
├──────────────────────────┤
│ Mineralization Engine    │
│ Alteration Engine        │
│ Structural Measurements  │
│ Geological Templates     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Export Services     │
├──────────────────────────┤
│ CSV Export               │
│ KML Export               │
│ PDF Generation           │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Offline Sync        │
└──────────────────────────┘
```

---

# 🗄️ Database Design

Aurquartz uses a relational geological data model.

## Core Entities

```txt
User
 └── Projects
       └── Localities
              └── Samples
                     ├── Photos
                     ├── Structural Measurements
                     ├── Mineralization Records
                     └── Alteration Records
```

---

## Database Schema Overview

```txt
User
- id
- name
- email
- role
- createdAt

Project
- id
- userId
- name
- code
- area
- description
- createdAt

Locality
- id
- projectId
- localityCode
- latitude
- longitude
- elevation
- notes

Sample
- id
- projectId
- localityId
- sampleCode
- rockType
- latitude
- longitude
- elevation
- fieldDescription
- mineralization
- alteration
- createdAt

Photo
- id
- sampleId
- filePath
- caption

Measurement
- id
- sampleId
- type
- strike
- dip
- trend
- plunge
```

---

# ⛏️ Geological Data System

Aurquartz uses structured geological templates instead of free-form inconsistent field entries.

This improves:

* Data consistency
* Geological interpretation
* GIS integration
* Searchability
* Statistical analysis
* Exploration workflows

---

## Supported Geological Data

### Rock Types

Supported categories include:

* Igneous Rocks
* Sedimentary Rocks
* Metamorphic Rocks
* Ultramafic Rocks
* Ore-Related Rocks
* Altered Rocks

---

### Mineralization Logging

Examples:

* Quartz Veins
* Sulfides
* Chromite
* Magnetite
* Pyrite
* Chalcopyrite
* Gossan
* Iron Oxides

---

### Alteration Logging

Examples:

* Silicification
* Serpentinization
* Carbonatization
* Chloritization
* Oxidation
* Hematization

---

### Structural Geology

Supported measurements:

* Strike
* Dip
* Dip Direction
* Trend
* Plunge
* Bedding
* Foliation
* Faults
* Joints
* Veins
* Shear Zones

---

# 🛰️ GPS & Mapping System

Aurquartz integrates geospatial field workflows directly into the platform.

## GPS Features

* Real-time GPS capture
* Elevation recording
* GPS accuracy validation
* Manual coordinate input
* Offline coordinate storage

---

## Interactive Mapping

Mapping is powered using Leaflet and React-Leaflet.

Features include:

* Interactive geological map
* Sample markers
* Locality markers
* Geological filtering
* Popup geological summaries
* Spatial visualization
* KML-compatible export

---

# 📡 Offline-First Architecture

One of the most critical engineering goals in Aurquartz is reliability under remote field conditions.

The platform follows an offline-first data strategy.

## Workflow

```txt
User Action
    ↓
Local Storage
    ↓
IndexedDB / SQLite
    ↓
Sync Queue
    ↓
Cloud Synchronization
```

---

## Offline Capabilities

* Create projects offline
* Add samples offline
* Save GPS data offline
* Store photos offline
* Edit records offline
* Queue synchronization requests
* Prevent accidental data loss

---

# 📤 Export Engine

Aurquartz includes a dedicated geological export system.

## Supported Formats

### CSV Export

Designed for:

* Excel
* QGIS
* ArcGIS Pro
* Leapfrog

---

### KML Export

Designed for:

* Google Earth visualization
* Quick geological review
* Spatial field analysis

---

### PDF Reports

Automatically generates professional field reports including:

* Project information
* Sample metadata
* GPS coordinates
* Geological descriptions
* Structural measurements
* Photos
* Geological maps
* User/team information

---

# 🔐 Security & Data Integrity

Aurquartz prioritizes geological data integrity.

## Security Measures

* JWT Authentication
* Protected API routes
* Validation pipelines
* Role-based access architecture
* Database constraints
* Duplicate sample prevention
* Sync conflict handling

---

# 🚀 Performance Considerations

The platform is optimized for large-scale field projects.

## Optimization Strategies

* Lazy loading
* Indexed geological queries
* Local caching
* Efficient map rendering
* Optimized photo compression
* Batched synchronization
* Incremental rendering

---

# 🧭 Future Roadmap

## Planned Features

### Geological Analysis

* Rose Diagram Generation
* Stereonet Analysis
* Structural Statistics

---

### AI Integration

Optional AI-assisted workflows:

* Rock type suggestions
* Geological description assistance
* Alteration recognition
* Geological anomaly detection

---

### Advanced GIS

* GeoJSON Export
* Shapefile Support
* Offline MBTiles
* Satellite Basemaps

---

### Exploration Extensions

* Geochemistry Integration
* Drillhole Data
* Core Logging
* Thin Section Records
* Microscope Imaging
* Team Collaboration

---

# 🧠 Engineering Philosophy

Aurquartz was designed around one principle:

> Geological field data should be structured, accessible, portable, and reliable.

The system avoids unnecessary complexity in the early stages and focuses first on solving the core geological field workflow:

```txt
Project
→ Sample
→ GPS
→ Photos
→ Geological Notes
→ Mineralization
→ Alteration
→ Structural Measurements
→ Map
→ Data Table
→ Export
```

This foundation allows the platform to evolve into a complete geological exploration ecosystem.

---

# ⚡ Technical Highlights

* Offline-first architecture
* GIS-compatible export pipelines
* Structured geological database design
* Modular scalable frontend
* Service-oriented backend
* Exploration-ready workflows
* Geological template systems
* Interactive mapping engine
* Field-optimized UI/UX
* Scalable synchronization architecture

---

# 📌 Status

Aurquartz is currently under active development.

The current focus is:

* Core geological field workflows
* Stable offline functionality
* GIS-ready exports
* Reliable data structures
* Modular architecture
* Geological usability

---

# 🌍 Final Statement

Aurquartz aims to modernize geological fieldwork by bridging:

* Geology
* GIS
* Field operations
* Data engineering
* Exploration workflows
* Modern software architecture

The goal is to transform fragmented geological workflows into a connected, scalable, and professional digital exploration environment.
