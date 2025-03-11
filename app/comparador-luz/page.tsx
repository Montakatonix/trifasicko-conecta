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
import { Zap, Info, Check, X } from 'lucide-react'
import { calcularCosteLuz, formatearPrecio, validarCUPS } from '@/lib/utils'

interface FormData {
  cups: string
  potenciaContratada: number
  consumoMensual: number
  discriminacionHoraria: boolean
  consumoPunta?: number
  consumoValle?: number
}

interface TarifaLuz {
  id: string
  comercializadora: string
  nombre: string
  potenciaContratada: number
  precioKWh?: number
  precioKwhPunta?: number
  precioKwhValle?: number
  descuento?: number
  permanencia: number
  caracteristicas: string[]
}

const tarifasDisponibles: TarifaLuz[] = [
  {
    id: '1',
    comercializadora: 'EnergíaVerde',
    nombre: 'Tarifa Eco Plus',
    potenciaContratada: 3.45,
    precioKWh: 0.149,
    descuento: 5,
    permanencia: 12,
    caracteristicas: ['100% energía renovable', 'Factura electrónica', 'App móvil'],
  },
  {
    id: '2',
    comercializadora: 'PowerSave',
    nombre: 'Tarifa Día y Noche',
    potenciaContratada: 4.6,
    precioKwhPunta: 0.168,
    precioKwhValle: 0.082,
    permanencia: 0,
    caracteristicas: ['Sin permanencia', 'Discriminación horaria', 'Atención 24/7'],
  },
  // Añadir más tarifas...
]

export default function ComparadorLuz() {
  const [formData, setFormData] = useState<FormData>({
    cups: '',
    potenciaContratada: 0,
    consumoMensual: 0,
    discriminacionHoraria: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultados, setResultados] = useState<TarifaLuz[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validar CUPS
      if (!validarCUPS(formData.cups)) {
        throw new Error('El código CUPS no es válido')
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Filtrar y ordenar tarifas según consumo
      const tarifasFiltradas = tarifasDisponibles
        .filter(tarifa => tarifa.potenciaContratada >= formData.potenciaContratada)
        .sort((a, b) => {
          const costeA = calcularCosteLuz(a, formData)
          const costeB = calcularCosteLuz(b, formData)
          return costeA - costeB
        })

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
        <h1 className="text-4xl font-bold">Comparador de Tarifas de Luz</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Encuentra la mejor tarifa eléctrica para tu hogar
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Datos de consumo</CardTitle>
          <CardDescription>
            Introduce los datos de tu suministro eléctrico para encontrar las mejores ofertas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cups">Código CUPS</Label>
              <Input
                id="cups"
                placeholder="ES0021000000000000AB"
                value={formData.cups}
                onChange={e => setFormData({ ...formData, cups: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                El CUPS es el código único de tu punto de suministro
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="potencia">Potencia contratada (kW)</Label>
              <Input
                id="potencia"
                type="number"
                step="0.01"
                min="0"
                value={formData.potenciaContratada || ''}
                onChange={e =>
                  setFormData({ ...formData, potenciaContratada: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Discriminación horaria</Label>
              <RadioGroup
                value={formData.discriminacionHoraria ? 'si' : 'no'}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    discriminacionHoraria: value === 'si',
                    consumoPunta: value === 'si' ? 0 : undefined,
                    consumoValle: value === 'si' ? 0 : undefined,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-dh" />
                  <Label htmlFor="no-dh">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="si-dh" />
                  <Label htmlFor="si-dh">Sí</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.discriminacionHoraria ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="consumo-punta">Consumo hora punta (kWh)</Label>
                  <Input
                    id="consumo-punta"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.consumoPunta || ''}
                    onChange={e =>
                      setFormData({ ...formData, consumoPunta: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumo-valle">Consumo hora valle (kWh)</Label>
                  <Input
                    id="consumo-valle"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.consumoValle || ''}
                    onChange={e =>
                      setFormData({ ...formData, consumoValle: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="consumo">Consumo mensual (kWh)</Label>
                <Input
                  id="consumo"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.consumoMensual || ''}
                  onChange={e =>
                    setFormData({ ...formData, consumoMensual: parseFloat(e.target.value) })
                  }
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner className="mr-2" /> : <Zap className="mr-2 h-4 w-4" />}
              Comparar tarifas
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
                    <CardTitle>{tarifa.comercializadora}</CardTitle>
                    <CardDescription>{tarifa.nombre}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(calcularCosteLuz(tarifa, formData))}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                    {tarifa.descuento && (
                      <Badge variant="secondary" className="mt-1">
                        {tarifa.descuento}% descuento
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
                      Potencia: {tarifa.potenciaContratada} kW
                    </li>
                    {tarifa.precioKWh && (
                      <li className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        Precio: {(tarifa.precioKWh * 100).toFixed(2)} cent/kWh
                      </li>
                    )}
                    {tarifa.precioKwhPunta && tarifa.precioKwhValle && (
                      <>
                        <li className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          Precio punta: {(tarifa.precioKwhPunta * 100).toFixed(2)} cent/kWh
                        </li>
                        <li className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          Precio valle: {(tarifa.precioKwhValle * 100).toFixed(2)} cent/kWh
                        </li>
                      </>
                    )}
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
