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
import { Calculator, Info, Check, X } from 'lucide-react'
import { calcularAhorroAnual, formatearPrecio } from '@/lib/utils'

interface FormData {
  gastoActualLuz: number
  gastoActualInternet: number
  incluyeLuz: boolean
  incluyeInternet: boolean
}

interface Ahorro {
  ahorroLuz: number
  ahorroInternet: number
  ahorroTotal: number
  mejorTarifaLuz: {
    comercializadora: string
    nombre: string
    precio: number
    caracteristicas: string[]
  }
  mejorTarifaInternet: {
    operador: string
    nombre: string
    precio: number
    caracteristicas: string[]
  }
}

export default function CalculadoraAhorro() {
  const [formData, setFormData] = useState<FormData>({
    gastoActualLuz: 0,
    gastoActualInternet: 0,
    incluyeLuz: true,
    incluyeInternet: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Ahorro | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validar datos
      if (formData.incluyeLuz && formData.gastoActualLuz <= 0) {
        throw new Error('El gasto actual de luz debe ser mayor que 0')
      }
      if (formData.incluyeInternet && formData.gastoActualInternet <= 0) {
        throw new Error('El gasto actual de internet debe ser mayor que 0')
      }

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simular cálculo de ahorro
      const mejorTarifaLuz = {
        comercializadora: 'EnergíaVerde',
        nombre: 'Tarifa Eco Plus',
        precio: formData.gastoActualLuz * 0.85, // 15% menos
        caracteristicas: [
          '100% energía renovable',
          'Sin permanencia',
          'Factura electrónica',
          'App de control',
        ],
      }

      const mejorTarifaInternet = {
        operador: 'FibraMax',
        nombre: 'Fibra 600Mb',
        precio: formData.gastoActualInternet * 0.8, // 20% menos
        caracteristicas: [
          'Fibra 600Mb simétricos',
          'Router WiFi 6',
          'Llamadas ilimitadas',
          'Sin permanencia',
        ],
      }

      const ahorroLuz = formData.incluyeLuz
        ? calcularAhorroAnual(formData.gastoActualLuz, mejorTarifaLuz.precio)
        : 0
      const ahorroInternet = formData.incluyeInternet
        ? calcularAhorroAnual(formData.gastoActualInternet, mejorTarifaInternet.precio)
        : 0

      setResultado({
        ahorroLuz,
        ahorroInternet,
        ahorroTotal: ahorroLuz + ahorroInternet,
        mejorTarifaLuz,
        mejorTarifaInternet,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Calculadora de Ahorro</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Descubre cuánto puedes ahorrar en tus facturas mensuales
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tus gastos actuales</CardTitle>
          <CardDescription>
            Introduce el importe mensual de tus facturas para calcular tu ahorro potencial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroup
                  value={formData.incluyeLuz ? 'si' : 'no'}
                  onValueChange={value =>
                    setFormData({ ...formData, incluyeLuz: value === 'si' })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="incluye-luz" />
                    <Label htmlFor="incluye-luz">Incluir factura de luz</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-incluye-luz" />
                    <Label htmlFor="no-incluye-luz">No incluir luz</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.incluyeLuz && (
                <div className="space-y-2">
                  <Label htmlFor="gasto-luz">Gasto mensual en luz (€)</Label>
                  <Input
                    id="gasto-luz"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.gastoActualLuz || ''}
                    onChange={e =>
                      setFormData({ ...formData, gastoActualLuz: parseFloat(e.target.value) })
                    }
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <RadioGroup
                  value={formData.incluyeInternet ? 'si' : 'no'}
                  onValueChange={value =>
                    setFormData({ ...formData, incluyeInternet: value === 'si' })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="incluye-internet" />
                    <Label htmlFor="incluye-internet">Incluir factura de internet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-incluye-internet" />
                    <Label htmlFor="no-incluye-internet">No incluir internet</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.incluyeInternet && (
                <div className="space-y-2">
                  <Label htmlFor="gasto-internet">Gasto mensual en internet (€)</Label>
                  <Input
                    id="gasto-internet"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.gastoActualInternet || ''}
                    onChange={e =>
                      setFormData({ ...formData, gastoActualInternet: parseFloat(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner className="mr-2" /> : <Calculator className="mr-2 h-4 w-4" />}
              Calcular ahorro
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      {resultado && (
        <div className="space-y-6">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>Tu ahorro potencial</CardTitle>
              <CardDescription>
                Basado en las mejores tarifas disponibles actualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {resultado.ahorroLuz > 0 && (
                  <div className="space-y-2 rounded-lg bg-background p-4">
                    <h4 className="font-medium">Ahorro en luz</h4>
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(resultado.ahorroLuz)}
                      <span className="text-sm font-normal text-muted-foreground">/año</span>
                    </div>
                  </div>
                )}
                {resultado.ahorroInternet > 0 && (
                  <div className="space-y-2 rounded-lg bg-background p-4">
                    <h4 className="font-medium">Ahorro en internet</h4>
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(resultado.ahorroInternet)}
                      <span className="text-sm font-normal text-muted-foreground">/año</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2 rounded-lg bg-background p-4">
                  <h4 className="font-medium">Ahorro total</h4>
                  <div className="text-2xl font-bold text-primary">
                    {formatearPrecio(resultado.ahorroTotal)}
                    <span className="text-sm font-normal text-muted-foreground">/año</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {resultado.ahorroLuz > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{resultado.mejorTarifaLuz.comercializadora}</CardTitle>
                    <CardDescription>{resultado.mejorTarifaLuz.nombre}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(resultado.mejorTarifaLuz.precio)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      Mejor tarifa de luz
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Características</h4>
                  <ul className="grid gap-2 text-sm">
                    {resultado.mejorTarifaLuz.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {resultado.ahorroInternet > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{resultado.mejorTarifaInternet.operador}</CardTitle>
                    <CardDescription>{resultado.mejorTarifaInternet.nombre}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(resultado.mejorTarifaInternet.precio)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      Mejor tarifa de internet
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Características</h4>
                  <ul className="grid gap-2 text-sm">
                    {resultado.mejorTarifaInternet.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
