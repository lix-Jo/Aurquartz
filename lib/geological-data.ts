import type { RockCategory, SelectOption } from './types'

// Complete Rock Database
export const rockDatabase: RockCategory[] = [
  {
    name: 'Igneous Rocks',
    subcategories: [
      {
        name: 'Plutonic (Intrusive)',
        rocks: ['Granite', 'Granodiorite', 'Tonalite', 'Diorite', 'Gabbro', 'Norite', 'Anorthosite', 'Peridotite', 'Dunite', 'Pyroxenite', 'Hornblendite', 'Syenite', 'Monzonite', 'Nepheline Syenite', 'Troctolite', 'Websterite', 'Lherzolite', 'Harzburgite', 'Wehrlite', 'Chromitite', 'Essexite', 'Theralite', 'Ijolite']
      },
      {
        name: 'Volcanic (Extrusive)',
        rocks: ['Rhyolite', 'Dacite', 'Andesite', 'Basalt', 'Trachyte', 'Phonolite', 'Obsidian', 'Pumice', 'Scoria', 'Tuff', 'Ignimbrite', 'Volcanic Breccia', 'Pillow Basalt', 'Komatiite', 'Picrite', 'Latite', 'Tephra', 'Lapilli Tuff', 'Agglomerate']
      },
      {
        name: 'Hypabyssal (Subvolcanic)',
        rocks: ['Dolerite', 'Diabase', 'Microgranite', 'Porphyry', 'Aplite', 'Pegmatite', 'Lamprophyre', 'Kimberlite', 'Lamproite', 'Carbonatite', 'Minette', 'Vogesite', 'Spessartite', 'Camptonite']
      }
    ]
  },
  {
    name: 'Sedimentary Rocks',
    subcategories: [
      {
        name: 'Clastic (Terrigenous)',
        rocks: ['Conglomerate', 'Breccia', 'Sandstone', 'Siltstone', 'Shale', 'Mudstone', 'Claystone', 'Arkose', 'Greywacke', 'Tillite', 'Diamictite', 'Wacke', 'Arenite', 'Rudite', 'Lutite']
      },
      {
        name: 'Chemical',
        rocks: ['Limestone', 'Dolostone', 'Dolomite', 'Chert', 'Flint', 'Rock Salt (Halite)', 'Rock Gypsum', 'Travertine', 'Tufa', 'Ite', 'Jasper', 'Banded Iron Formation (BIF)', 'Phosphorite', 'Evaporite', 'Anhydrite']
      },
      {
        name: 'Organic/Biogenic',
        rocks: ['Coal', 'Lignite', 'Peat', 'Oil Shale', 'Chalk', 'Coquina', 'Fossiliferous Limestone', 'Reef Limestone', 'Diatomite', 'Radiolarite', 'Bone Bed']
      }
    ]
  },
  {
    name: 'Metamorphic Rocks',
    subcategories: [
      {
        name: 'Foliated',
        rocks: ['Slate', 'Phyllite', 'Schist', 'Gneiss', 'Migmatite', 'Mylonite', 'Augen Gneiss', 'Mica Schist', 'Chlorite Schist', 'Talc Schist', 'Garnet Schist', 'Blueschist', 'Greenschist']
      },
      {
        name: 'Non-foliated',
        rocks: ['Marble', 'Quartzite', 'Hornfels', 'Granulite', 'Serpentinite', 'Soapstone', 'Greenstone', 'Eclogite', 'Amphibolite', 'Skarn', 'Tactite', 'Calc-silicate Rock', 'Meta-ironstone']
      },
      {
        name: 'Contact Metamorphic',
        rocks: ['Spotted Slate', 'Cordierite Hornfels', 'Pyroxene Hornfels', 'Buchite', 'Sanidine Hornfels']
      },
      {
        name: 'Dynamic/Cataclastic',
        rocks: ['Cataclasite', 'Pseudotachylite', 'Fault Breccia', 'Gouge', 'Ultramylonite']
      },
      {
        name: 'Metasomatic',
        rocks: ['Greisen', 'Fenite', 'Rodingite', 'Albitite', 'Episyenite', 'Listvenite']
      }
    ]
  },
  {
    name: 'Hybrid / Special Rock Systems',
    subcategories: [
      {
        name: 'Ore-bearing',
        rocks: ['Massive Sulfide', 'Banded Iron Formation', 'Chromitite', 'Magnetitite', 'Laterite', 'Bauxite', 'Gossan', 'Supergene Enrichment Zone', 'VMS Ore', 'SEDEX Ore', 'Porphyry Copper', 'Skarn Ore']
      },
      {
        name: 'Hydrothermal',
        rocks: ['Silicified Rock', 'Propylitized Rock', 'Argillic Alteration Zone', 'Phyllic Alteration Zone', 'Potassic Alteration Zone', 'Epithermal Vein', 'Mesothermal Vein', 'Replacement Body']
      },
      {
        name: 'Residual/Weathering Products',
        rocks: ['Saprolite', 'Laterite', 'Terra Rossa', 'Calcrete', 'Silcrete', 'Ferricrete', 'Duricrust', 'Regolith']
      },
      {
        name: 'Impact/Shock',
        rocks: ['Impactite', 'Suevite', 'Shatter Cone', 'Impact Melt', 'Tektite']
      }
    ]
  }
]

// Color options
export const colorOptions: SelectOption[] = [
  { value: 'white', label: 'White' },
  { value: 'cream', label: 'Cream' },
  { value: 'beige', label: 'Beige' },
  { value: 'buff', label: 'Buff' },
  { value: 'tan', label: 'Tan' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'ochre-yellow', label: 'Ochre yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
  { value: 'red', label: 'Red' },
  { value: 'brick-red', label: 'Brick red' },
  { value: 'maroon', label: 'Maroon' },
  { value: 'brown', label: 'Brown' },
  { value: 'light-brown', label: 'Light brown' },
  { value: 'dark-brown', label: 'Dark brown' },
  { value: 'reddish-brown', label: 'Reddish brown' },
  { value: 'yellowish-brown', label: 'Yellowish brown' },
  { value: 'orange-brown', label: 'Orange brown' },
  { value: 'gray', label: 'Gray' },
  { value: 'light-gray', label: 'Light gray' },
  { value: 'dark-gray', label: 'Dark gray' },
  { value: 'greenish-gray', label: 'Greenish gray' },
  { value: 'bluish-gray', label: 'Bluish gray' },
  { value: 'black', label: 'Black' },
  { value: 'green', label: 'Green' },
  { value: 'light-green', label: 'Light green' },
  { value: 'dark-green', label: 'Dark green' },
  { value: 'olive-green', label: 'Olive green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'rusty-iron-stained', label: 'Rusty / Iron-stained' },
  { value: 'hematitic-red', label: 'Hematitic red' },
  { value: 'limonitic-yellow-brown', label: 'Limonitic yellow-brown' },
  { value: 'gossanous-red-brown', label: 'Gossanous red-brown' },
  { value: 'malachite-green', label: 'Malachite green' },
  { value: 'azurite-blue', label: 'Azurite blue' },
  { value: 'chloritic-green', label: 'Chloritic green' },
  { value: 'epidote-green', label: 'Epidote green' },
  { value: 'manganese-black', label: 'Manganese black' },
  { value: 'sulfide-gray-black', label: 'Sulfide gray-black' },
  { value: 'variegated-mixed', label: 'Variegated / Mixed colors' },
  { value: 'other', label: 'Other' }
]

// Weathering options
export const weatheringOptions: SelectOption[] = [
  { value: 'w1', label: 'Fresh (W1)' },
  { value: 'w2', label: 'Slightly Weathered (W2)' },
  { value: 'w3', label: 'Moderately Weathered (W3)' },
  { value: 'w4', label: 'Highly Weathered (W4)' },
  { value: 'w5', label: 'Completely Weathered (W5)' },
  { value: 'w6', label: 'Residual Soil / Saprolite (W6)' }
]

// Mineralization options
export const mineralizationOptions: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'no-visible', label: 'No visible mineralization' },
  { value: 'disseminated-sulfides', label: 'Disseminated sulfides' },
  { value: 'massive-sulfides', label: 'Massive sulfides' },
  { value: 'semi-massive-sulfides', label: 'Semi-massive sulfides' },
  { value: 'sulfide-stringers', label: 'Sulfide stringers' },
  { value: 'sulfide-veinlets', label: 'Sulfide veinlets' },
  { value: 'quartz-veins-sulfides', label: 'Quartz veins with sulfides' },
  { value: 'stockwork', label: 'Stockwork mineralization' },
  { value: 'breccia-hosted', label: 'Breccia-hosted mineralization' },
  { value: 'shear-zone-hosted', label: 'Shear-zone hosted mineralization' },
  { value: 'fault-controlled', label: 'Fault-controlled mineralization' },
  { value: 'vein-hosted', label: 'Vein-hosted mineralization' },
  { value: 'banded', label: 'Banded mineralization' },
  { value: 'layered-stratiform', label: 'Layered / Stratiform mineralization' },
  { value: 'podiform', label: 'Podiform mineralization' },
  { value: 'gossan', label: 'Gossan / Iron oxide cap' },
  { value: 'iron-oxides', label: 'Iron oxides' },
  { value: 'copper-oxides', label: 'Copper oxides' },
  { value: 'manganese-oxides', label: 'Manganese oxides' },
  { value: 'gold', label: 'Gold mineralization' },
  { value: 'copper', label: 'Copper mineralization' },
  { value: 'zinc-lead', label: 'Zinc-lead mineralization' },
  { value: 'nickel-copper', label: 'Nickel-copper mineralization' },
  { value: 'chromite', label: 'Chromite mineralization' },
  { value: 'magnetite', label: 'Magnetite mineralization' },
  { value: 'hematite', label: 'Hematite mineralization' },
  { value: 'barite', label: 'Barite mineralization' },
  { value: 'fluorite', label: 'Fluorite mineralization' },
  { value: 'ree', label: 'REE mineralization' },
  { value: 'other', label: 'Other' }
]

// Alteration Type options
export const alterationTypeOptions: SelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'silicification', label: 'Silicification' },
  { value: 'sericitization', label: 'Sericitization' },
  { value: 'chloritization', label: 'Chloritization' },
  { value: 'epidotization', label: 'Epidotization' },
  { value: 'carbonatization', label: 'Carbonatization' },
  { value: 'argillic', label: 'Argillic alteration' },
  { value: 'advanced-argillic', label: 'Advanced argillic alteration' },
  { value: 'propylitic', label: 'Propylitic alteration' },
  { value: 'phyllic', label: 'Phyllic alteration' },
  { value: 'potassic', label: 'Potassic alteration' },
  { value: 'sodic-albitization', label: 'Sodic alteration / Albitization' },
  { value: 'hematization', label: 'Hematization' },
  { value: 'limonitization', label: 'Limonitization' },
  { value: 'goethitization', label: 'Goethitization' },
  { value: 'oxidation', label: 'Oxidation' },
  { value: 'kaolinization', label: 'Kaolinization' },
  { value: 'dolomitization', label: 'Dolomitization' },
  { value: 'calcitization', label: 'Calcitization' },
  { value: 'pyritization', label: 'Pyritization' },
  { value: 'tourmalinization', label: 'Tourmalinization' },
  { value: 'serpentinization', label: 'Serpentinization' },
  { value: 'talc', label: 'Talc alteration' },
  { value: 'listvenitization', label: 'Listvenitization' },
  { value: 'skarn', label: 'Skarn alteration' },
  { value: 'greisenization', label: 'Greisenization' },
  { value: 'fenitization', label: 'Fenitization' },
  { value: 'bleaching', label: 'Bleaching' },
  { value: 'leaching', label: 'Leaching' },
  { value: 'weathering-related', label: 'Weathering-related alteration' },
  { value: 'clay', label: 'Clay alteration' },
  { value: 'iron-staining', label: 'Iron staining' },
  { value: 'manganese-staining', label: 'Manganese staining' },
  { value: 'mixed', label: 'Mixed alteration' },
  { value: 'other', label: 'Other' }
]

// Alteration Intensity options
export const alterationIntensityOptions: SelectOption[] = [
  { value: '0', label: 'None (0)' },
  { value: '1', label: 'Weak (1)' },
  { value: '2', label: 'Moderate (2)' },
  { value: '3', label: 'Strong (3)' },
  { value: '4', label: 'Intense (4)' },
  { value: '5', label: 'Pervasive / Complete (5)' }
]

// Structural Feature options
// Removed: Vein, Contact
// Renamed: Lineation -> Mineral Lineation
export const structuralFeatureOptions: SelectOption[] = [
  { value: 'bedding', label: 'Bedding' },
  { value: 'fault', label: 'Fault' },
  { value: 'joint', label: 'Joint' },
  { value: 'foliation', label: 'Foliation' },
  { value: 'cleavage', label: 'Cleavage' },
  { value: 'mineral-lineation', label: 'Mineral Lineation' },
  { value: 'fold-axis', label: 'Fold Axis' },
  { value: 'slickenside', label: 'Slickenside' }
]

// Grain Size / Texture options
export const grainSizeOptions: SelectOption[] = [
  { value: 'very-fine', label: 'Very Fine (<0.1mm)' },
  { value: 'fine', label: 'Fine (0.1-0.5mm)' },
  { value: 'medium', label: 'Medium (0.5-2mm)' },
  { value: 'coarse', label: 'Coarse (2-5mm)' },
  { value: 'very-coarse', label: 'Very Coarse (5-10mm)' },
  { value: 'pegmatitic', label: 'Pegmatitic (>10mm)' },
  { value: 'aphanitic', label: 'Aphanitic' },
  { value: 'phaneritic', label: 'Phaneritic' },
  { value: 'porphyritic', label: 'Porphyritic' },
  { value: 'glassy', label: 'Glassy' },
  { value: 'vesicular', label: 'Vesicular' },
  { value: 'amygdaloidal', label: 'Amygdaloidal' }
]

// Helper function to calculate dip direction from strike
export function calculateDipDirection(strike: number): string {
  if (strike >= 337.5 || strike < 22.5) return 'N'
  if (strike >= 22.5 && strike < 67.5) return 'NE'
  if (strike >= 67.5 && strike < 112.5) return 'E'
  if (strike >= 112.5 && strike < 157.5) return 'SE'
  if (strike >= 157.5 && strike < 202.5) return 'S'
  if (strike >= 202.5 && strike < 247.5) return 'SW'
  if (strike >= 247.5 && strike < 292.5) return 'W'
  if (strike >= 292.5 && strike < 337.5) return 'NW'
  return ''
}

// Get all rock names for search
export function getAllRockNames(): string[] {
  const rocks: string[] = []
  rockDatabase.forEach(category => {
    category.subcategories.forEach(subcategory => {
      rocks.push(...subcategory.rocks)
    })
  })
  return rocks
}

// Get subcategories for a category
export function getSubcategories(categoryName: string): RockSubcategory[] {
  const category = rockDatabase.find(c => c.name === categoryName)
  return category?.subcategories || []
}

// Get rocks for a subcategory
export function getRocksForSubcategory(categoryName: string, subcategoryName: string): string[] {
  const category = rockDatabase.find(c => c.name === categoryName)
  const subcategory = category?.subcategories.find(s => s.name === subcategoryName)
  return subcategory?.rocks || []
}
