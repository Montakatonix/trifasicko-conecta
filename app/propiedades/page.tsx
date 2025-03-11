import React from 'react'
import { PropertySearch, PropertyFilters } from '@/components/PropertySearch'
import { PropertyGrid, Property } from '@/components/PropertyGrid'

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Villa moderna con vistas al mar',
    description: 'Espectacular villa de diseño moderno con vistas panorámicas al mar Mediterráneo.',
    price: 750000,
    location: 'Costa del Sol, Málaga',
    type: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    images: ['/images/inmuebles/casa1-1.jpg', '/images/inmuebles/casa1-2.jpg', '/images/inmuebles/casa1-3.jpg'],
    features: ['Piscina', 'Jardín', 'Garaje', 'Terraza', 'Aire acondicionado', 'Calefacción']
  },
  {
    id: '2',
    title: 'Ático de lujo en el centro',
    description: 'Exclusivo ático con terraza panorámica en pleno centro de la ciudad.',
    price: 495000,
    location: 'Centro, Madrid',
    type: 'piso',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    images: ['/images/inmuebles/piso1-1.jpg', '/images/inmuebles/piso1-2.jpg', '/images/inmuebles/piso1-3.jpg'],
    features: ['Terraza', 'Plaza de garaje', 'Trastero', 'Ascensor', 'Seguridad 24h']
  },
  // Añade más propiedades aquí...
]

export default function PropertiesPage() {
  const [filteredProperties, setFilteredProperties] = React.useState<Property[]>(MOCK_PROPERTIES)

  const handleSearch = (filters: PropertyFilters) => {
    const filtered = MOCK_PROPERTIES.filter(property => {
      const matchesLocation = !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesPrice = property.price >= filters.minPrice && 
        property.price <= filters.maxPrice
      const matchesType = filters.type === 'all' || 
        property.type === filters.type
      const matchesBedrooms = property.bedrooms >= filters.bedrooms
      const matchesBathrooms = property.bathrooms >= filters.bathrooms

      return matchesLocation && matchesPrice && matchesType && 
        matchesBedrooms && matchesBathrooms
    })

    setFilteredProperties(filtered)
  }

  const handlePropertyClick = (property: Property) => {
    // Implementar navegación a la página de detalles
    console.log('Clicked property:', property)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Encuentra tu hogar ideal
            </h1>
            <p className="text-xl text-muted-foreground">
              Explora nuestra selección de propiedades y encuentra la que mejor se adapte a ti
            </p>
          </div>

          <PropertySearch onSearch={handleSearch} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {filteredProperties.length} propiedades encontradas
              </h2>
              <div className="flex items-center space-x-4">
                {/* Aquí puedes agregar controles de ordenación */}
              </div>
            </div>

            <PropertyGrid
              properties={filteredProperties}
              onPropertyClick={handlePropertyClick}
            />
          </div>
        </div>
      </div>
    </main>
  )
} 