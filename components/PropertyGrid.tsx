import React from 'react'
import Image from 'next/image'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Heart, Share2, Maximize2 } from 'lucide-react'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: 'casa' | 'piso'
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  features: string[]
}

interface PropertyGridProps {
  properties: Property[]
  onPropertyClick: (property: Property) => void
}

export function PropertyGrid({ properties, onPropertyClick }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden card-hover">
          <div className="relative aspect-[4/3] group">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="text-sm">
                {property.type === 'casa' ? 'Casa' : 'Piso'}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold line-clamp-1">{property.title}</h3>
              <p className="text-muted-foreground line-clamp-1">{property.location}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(property.price)}
                </p>
              </div>
              <div className="flex space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <span className="text-sm">{property.bedrooms} hab</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">{property.bathrooms} baños</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">{property.area} m²</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 3 && (
                <Badge variant="outline">+{property.features.length - 3}</Badge>
              )}
            </div>

            <Button
              onClick={() => onPropertyClick(property)}
              className="w-full btn-primary"
            >
              Ver detalles
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
} 