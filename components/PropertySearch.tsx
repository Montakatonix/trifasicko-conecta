import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Slider } from './ui/slider'

interface PropertySearchProps {
  onSearch: (filters: PropertyFilters) => void
}

export interface PropertyFilters {
  location: string
  minPrice: number
  maxPrice: number
  type: 'casa' | 'piso' | 'all'
  bedrooms: number
  bathrooms: number
}

export function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = React.useState<PropertyFilters>({
    location: '',
    minPrice: 0,
    maxPrice: 1000000,
    type: 'all',
    bedrooms: 1,
    bathrooms: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  return (
    <Card className="p-6 animate-fade-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              placeholder="Ciudad, barrio o código postal"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label>Rango de precio</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="input-field"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de propiedad</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={filters.type === 'all' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, type: 'all' })}
                className="flex-1"
              >
                Todos
              </Button>
              <Button
                type="button"
                variant={filters.type === 'casa' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, type: 'casa' })}
                className="flex-1"
              >
                Casa
              </Button>
              <Button
                type="button"
                variant={filters.type === 'piso' ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, type: 'piso' })}
                className="flex-1"
              >
                Piso
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Habitaciones</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[filters.bedrooms]}
                min={1}
                max={6}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, bedrooms: value[0] })}
                className="flex-1"
              />
              <span className="w-12 text-center">{filters.bedrooms}+</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Baños</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[filters.bathrooms]}
                min={1}
                max={4}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, bathrooms: value[0] })}
                className="flex-1"
              />
              <span className="w-12 text-center">{filters.bathrooms}+</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="btn-primary">
            Buscar propiedades
          </Button>
        </div>
      </form>
    </Card>
  )
} 