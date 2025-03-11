'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error'
import { Badge } from '@/components/ui/badge'
import { Wifi, Info, Check, X } from 'lucide-react'
import { formatearPrecio, validarCodigoPostal } from '@/lib/utils'
import type { TarifaInternet } from '@/lib/types'

interface FormData {
  codigoPostal: string
  velocidadMinima: number
  tipoConexion: string
  precioMaximo: number
  sinPermanencia: boolean
}

const tarifasDisponibles: TarifaInternet[] = [
  {
    id: '1',
    operador: 'FibraMax',
    nombre: 'Fibra 600Mb',
    tipo: 'fibra',
    velocidadBajada: 600,
    velocidadSubida: 600,
    precio: 39.90,
    permanencia: 12,
    cobertura: ['28001', '28002', '28003'],
    caracteristicas: ['Router WiFi 6', 'Llamadas ilimitadas', 'Instalación gratuita'],
    urlContratacion: 'https://fibramax.com',
    logoUrl: '/logos/fibramax.png'
  },
  {
    id: '2',
    operador: 'TeleRapid',
    nombre: 'Fibra + Móvil',
    tipo: 'fibra',
    velocidadBajada: 1000,
    velocidadSubida: 1000,
    precio: 49.90,
    permanencia: 0,
    cobertura: ['28001', '28002', '28003', '28004'],
    caracteristicas: ['1000Mb simétricos', '2 líneas móviles', 'TV incluida'],
    urlContratacion: 'https://telerapid.com',
    logoUrl: '/logos/telerapid.png'
  },
  // Añadir más tarifas...
]

export default function ComparadorInternet() {
  const [formData, setFormData] = useState<FormData>({
    codigoPostal: '',
    velocidadMinima: 100,
    tipoConexion: 'fibra',
    precioMaximo: 100,
    sinPermanencia: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultados, setResultados] = useState<TarifaInternet[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validar código postal
      if (!validarCodigoPostal(formData.codigoPostal)) {
        throw new Error('El código postal no es válido')
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Filtrar y ordenar tarifas según criterios
      const tarifasFiltradas = tarifasDisponibles
        .filter(tarifa => {
          return (
            tarifa.cobertura.includes(formData.codigoPostal) &&
            tarifa.velocidadBajada >= formData.velocidadMinima &&
            tarifa.tipo === formData.tipoConexion &&
            tarifa.precio <= formData.precioMaximo &&
            (!formData.sinPermanencia || tarifa.permanencia === 0)
          )
        })
        .sort((a, b) => a.precio - b.precio)

      setResultados(tarifasFiltradas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Comparador de Internet</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Encuentra la mejor tarifa de fibra y móvil para tu hogar
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Buscar ofertas</CardTitle>
          <CardDescription>
            Introduce tus preferencias para encontrar las mejores tarifas disponibles en tu zona
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="codigo-postal">Código postal</Label>
              <Input
                id="codigo-postal"
                placeholder="28001"
                value={formData.codigoPostal}
                onChange={e => setFormData({ ...formData, codigoPostal: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                Necesitamos tu código postal para mostrar las ofertas disponibles en tu zona
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tipo de conexión</Label>
              <RadioGroup
                value={formData.tipoConexion}
                onValueChange={value => setFormData({ ...formData, tipoConexion: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fibra" id="fibra" />
                  <Label htmlFor="fibra">Fibra</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adsl" id="adsl" />
                  <Label htmlFor="adsl">ADSL</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="velocidad">Velocidad mínima (Mb)</Label>
              <Input
                id="velocidad"
                type="number"
                min="0"
                step="50"
                value={formData.velocidadMinima}
                onChange={e => setFormData({ ...formData, velocidadMinima: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio máximo (€)</Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="5"
                value={formData.precioMaximo}
                onChange={e => setFormData({ ...formData, precioMaximo: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroup
                value={formData.sinPermanencia ? 'si' : 'no'}
                onValueChange={value => setFormData({ ...formData, sinPermanencia: value === 'si' })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="con-permanencia" />
                  <Label htmlFor="con-permanencia">Con permanencia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="sin-permanencia" />
                  <Label htmlFor="sin-permanencia">Sin permanencia</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner className="mr-2" /> : <Wifi className="mr-2 h-4 w-4" />}
              Buscar ofertas
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      {resultados.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Resultados</h2>
          {resultados.map(tarifa => (
            <Card key={tarifa.id} className="overflow-hidden">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tarifa.operador}</CardTitle>
                    <CardDescription>{tarifa.nombre}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(tarifa.precio)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                    {tarifa.permanencia === 0 && (
                      <Badge variant="secondary" className="mt-1">
                        Sin permanencia
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Detalles de la tarifa</h4>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Velocidad: {tarifa.velocidadBajada}Mb/{tarifa.velocidadSubida}Mb
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Tipo: {tarifa.tipo.toUpperCase()}
                    </li>
                    <li className="flex items-center gap-2">
                      {tarifa.permanencia > 0 ? (
                        <>
                          <X className="h-4 w-4 text-destructive" />
                          Permanencia de {tarifa.permanencia} meses
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 text-primary" />
                          Sin permanencia
                        </>
                      )}
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Características</h4>
                  <ul className="grid gap-2 text-sm">
                    {tarifa.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
