'use client'

import { useState } from 'react'

import Image from 'next/image'

import {
  ArrowRight,
  Bath,
  BedDouble,
  Box,
  Building,
  Building2,
  Droplet,
  Euro,
  Flame,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Store,
  Wifi,
  Zap,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useAuth } from '@/lib/auth'
import type { FiltrosInmuebles, Inmueble } from '@/lib/types'
import { formatearPrecio } from '@/lib/utils'

// Datos de ejemplo de inmuebles
const inmueblesEjemplo: Inmueble[] = [
  {
    id: '1',
    tipo: 'piso',
    operacion: 'venta',
    titulo: 'Piso reformado con certificación energética A',
    descripcion:
      'Magnífico piso totalmente reformado con las mejores calidades. Cuenta con sistema de aerotermia, paneles solares y domótica integrada para máxima eficiencia energética.',
    precio: 295000,
    superficie: 90,
    habitaciones: 3,
    banos: 2,
    caracteristicas: [
      'Reformado 2023',
      'Aerotermia',
      'Paneles solares',
      'Domótica',
      'Armarios empotrados',
      'Cocina equipada',
      'Terraza',
    ],
    servicios: {
      agua: true,
      luz: true,
      gas: false,
      internet: true,
    },
    eficienciaEnergetica: {
      certificado: 'A',
      consumoAnual: 45,
      emisiones: 9,
    },
    ubicacion: {
      direccion: 'Calle Ejemplo 123',
      codigoPostal: '28001',
      ciudad: 'Madrid',
      provincia: 'Madrid',
      coordenadas: {
        lat: 40.4168,
        lng: -3.7038,
      },
    },
    imagenes: [
      '/images/inmuebles/piso1-1.jpg',
      '/images/inmuebles/piso1-2.jpg',
      '/images/inmuebles/piso1-3.jpg',
    ],
    video360: 'https://tour360.com/piso1',
    contacto: {
      nombre: 'Ana García',
      telefono: '600123456',
      email: 'ana@inmobiliaria.com',
      horario: 'L-V: 9:00-20:00',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    tipo: 'casa',
    operacion: 'venta',
    titulo: 'Chalet independiente con piscina y jardín',
    descripcion:
      'Espectacular chalet independiente en urbanización privada. Cuenta con piscina, jardín y garaje para dos coches. Excelente eficiencia energética gracias a su orientación y materiales.',
    precio: 495000,
    superficie: 250,
    habitaciones: 4,
    banos: 3,
    caracteristicas: [
      'Piscina privada',
      'Jardín 500m²',
      'Garaje 2 coches',
      'Sala de juegos',
      'Bodega',
      'Sistema de riego',
      'Alarma',
    ],
    servicios: {
      agua: true,
      luz: true,
      gas: true,
      internet: true,
    },
    eficienciaEnergetica: {
      certificado: 'B',
      consumoAnual: 85,
      emisiones: 15,
    },
    ubicacion: {
      direccion: 'Calle Ejemplo 456',
      codigoPostal: '28023',
      ciudad: 'Madrid',
      provincia: 'Madrid',
      coordenadas: {
        lat: 40.4489,
        lng: -3.7619,
      },
    },
    imagenes: [
      '/images/inmuebles/casa1-1.jpg',
      '/images/inmuebles/casa1-2.jpg',
      '/images/inmuebles/casa1-3.jpg',
    ],
    contacto: {
      nombre: 'Carlos Martínez',
      telefono: '600789012',
      email: 'carlos@inmobiliaria.com',
      horario: 'L-V: 9:00-20:00, S: 10:00-14:00',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function InmobiliariaPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [operacion, setOperacion] = useState<'venta' | 'alquiler'>('venta')
  const [inmuebles, setInmuebles] = useState<Inmueble[]>(inmueblesEjemplo)

  const [filtros, setFiltros] = useState<FiltrosInmuebles>({
    operacion: 'venta',
    tipo: [],
    precioMin: 0,
    precioMax: 1000000,
    superficieMin: 0,
    superficieMax: 500,
    habitacionesMin: 0,
    banosMin: 0,
    serviciosRequeridos: [],
    eficienciaEnergeticaMin: 'G',
  })

  const handleFiltrosChange = (field: keyof FiltrosInmuebles, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleServicioToggle = (servicio: 'agua' | 'luz' | 'gas' | 'internet') => {
    setFiltros((prev) => {
      const servicios = prev.serviciosRequeridos || []
      const nuevosServicios = servicios.includes(servicio)
        ? servicios.filter((s) => s !== servicio)
        : [...servicios, servicio]
      return {
        ...prev,
        serviciosRequeridos: nuevosServicios,
      }
    })
  }

  const IconoTipo = {
    piso: Building,
    casa: Home,
    chalet: Home,
    local: Store,
    oficina: Building2,
  }

  const IconoServicio = {
    agua: Droplet,
    luz: Zap,
    gas: Flame,
    internet: Wifi,
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold mb-4'>Encuentra tu hogar ideal</h1>
        <p className='text-xl text-muted-foreground'>
          Viviendas eficientes y sostenibles para un futuro mejor
        </p>
      </div>

      <Tabs
        value={operacion}
        onValueChange={(v) => {
          setOperacion(v as 'venta' | 'alquiler')
          handleFiltrosChange('operacion', v)
        }}
      >
        <TabsList className='grid w-full grid-cols-2 mb-8'>
          <TabsTrigger value='venta'>Comprar</TabsTrigger>
          <TabsTrigger value='alquiler'>Alquilar</TabsTrigger>
        </TabsList>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Filtros de búsqueda</CardTitle>
            <CardDescription>Personaliza tu búsqueda según tus necesidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div>
                <Label>Tipo de inmueble</Label>
                <div className='space-y-2 mt-2'>
                  {['piso', 'casa', 'chalet', 'local', 'oficina'].map((tipo) => (
                    <div key={tipo} className='flex items-center'>
                      <Checkbox
                        checked={filtros.tipo?.includes(tipo)}
                        onCheckedChange={(checked) => {
                          const tipos = filtros.tipo || []
                          handleFiltrosChange(
                            'tipo',
                            checked ? [...tipos, tipo] : tipos.filter((t) => t !== tipo)
                          )
                        }}
                      />
                      <Label className='ml-2 capitalize'>{tipo}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Precio ({operacion === 'venta' ? '€' : '€/mes'})</Label>
                <div className='space-y-4 mt-2'>
                  <div>
                    <Input
                      type='number'
                      placeholder='Mínimo'
                      value={filtros.precioMin}
                      onChange={(e) => handleFiltrosChange('precioMin', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Input
                      type='number'
                      placeholder='Máximo'
                      value={filtros.precioMax}
                      onChange={(e) => handleFiltrosChange('precioMax', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Superficie (m²)</Label>
                <div className='space-y-4 mt-2'>
                  <div>
                    <Input
                      type='number'
                      placeholder='Mínima'
                      value={filtros.superficieMin}
                      onChange={(e) => handleFiltrosChange('superficieMin', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Input
                      type='number'
                      placeholder='Máxima'
                      value={filtros.superficieMax}
                      onChange={(e) => handleFiltrosChange('superficieMax', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Habitaciones mínimas</Label>
                <Select
                  value={String(filtros.habitacionesMin)}
                  onValueChange={(v) => handleFiltrosChange('habitacionesMin', Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n === 0 ? 'Cualquiera' : `${n}+`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Baños mínimos</Label>
                <Select
                  value={String(filtros.banosMin)}
                  onValueChange={(v) => handleFiltrosChange('banosMin', Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n === 0 ? 'Cualquiera' : `${n}+`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Servicios requeridos</Label>
                <div className='grid grid-cols-2 gap-2 mt-2'>
                  {(['agua', 'luz', 'gas', 'internet'] as const).map((servicio) => {
                    const Icon = IconoServicio[servicio]
                    return (
                      <div key={servicio} className='flex items-center'>
                        <Checkbox
                          checked={filtros.serviciosRequeridos?.includes(servicio)}
                          onCheckedChange={() => handleServicioToggle(servicio)}
                        />
                        <Label className='ml-2 flex items-center'>
                          <Icon className='h-4 w-4 mr-1' />
                          <span className='capitalize'>{servicio}</span>
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {inmuebles
            .filter((i) => i.operacion === operacion)
            .map((inmueble) => {
              const Icon = IconoTipo[inmueble.tipo]
              return (
                <Card key={inmueble.id} className='flex flex-col'>
                  <CardHeader>
                    <div className='relative h-48 mb-4 rounded-lg overflow-hidden'>
                      <Image
                        src={inmueble.imagenes[0]}
                        alt={inmueble.titulo}
                        width={200}
                        height={200}
                        className='object-cover w-full h-full'
                        priority
                      />
                      {inmueble.video360 && (
                        <Badge className='absolute top-2 right-2 bg-primary'>
                          <Box className='h-4 w-4 mr-1' />
                          Tour 360°
                        </Badge>
                      )}
                    </div>
                    <div className='flex items-center justify-between mb-2'>
                      <Badge variant='outline' className='flex items-center'>
                        <Icon className='h-4 w-4 mr-2' />
                        {inmueble.tipo.charAt(0).toUpperCase() + inmueble.tipo.slice(1)}
                      </Badge>
                      <Badge
                        className={`bg-green-${
                          inmueble.eficienciaEnergetica.certificado === 'A'
                            ? '500'
                            : inmueble.eficienciaEnergetica.certificado === 'B'
                              ? '400'
                              : '300'
                        }`}
                      >
                        Certificado {inmueble.eficienciaEnergetica.certificado}
                      </Badge>
                    </div>
                    <CardTitle>{inmueble.titulo}</CardTitle>
                    <CardDescription>
                      <div className='flex items-center'>
                        <MapPin className='h-4 w-4 mr-1' />
                        {inmueble.ubicacion.ciudad}, {inmueble.ubicacion.provincia}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex-grow'>
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                      <div className='flex items-center'>
                        <Euro className='h-4 w-4 mr-2' />
                        <span className='font-bold'>
                          {formatearPrecio(inmueble.precio)}
                          {operacion === 'alquiler' && '/mes'}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <Ruler className='h-4 w-4 mr-2' />
                        <span>{inmueble.superficie} m²</span>
                      </div>
                      <div className='flex items-center'>
                        <BedDouble className='h-4 w-4 mr-2' />
                        <span>{inmueble.habitaciones} hab.</span>
                      </div>
                      <div className='flex items-center'>
                        <Bath className='h-4 w-4 mr-2' />
                        <span>{inmueble.banos} baños</span>
                      </div>
                    </div>

                    <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
                      {inmueble.descripcion}
                    </p>

                    <div className='flex flex-wrap gap-2'>
                      {inmueble.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                        <Badge key={index} variant='secondary'>
                          {caracteristica}
                        </Badge>
                      ))}
                      {inmueble.caracteristicas.length > 3 && (
                        <Badge variant='secondary'>+{inmueble.caracteristicas.length - 3}</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col space-y-2'>
                    <div className='flex items-center justify-between w-full text-sm text-muted-foreground'>
                      <div className='flex items-center'>
                        <Phone className='h-4 w-4 mr-1' />
                        {inmueble.contacto.telefono}
                      </div>
                      <div className='flex items-center'>
                        <Mail className='h-4 w-4 mr-1' />
                        {inmueble.contacto.email}
                      </div>
                    </div>
                    <Button className='w-full'>
                      Ver detalles
                      <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
        </div>
      </Tabs>

      <div className='flex items-center justify-center'>
        <Image
          src='/images/inmobiliaria.webp'
          alt='Servicios Inmobiliarios'
          width={800}
          height={400}
          className='rounded-lg shadow-lg'
          priority
        />
      </div>
    </div>
  )
}
