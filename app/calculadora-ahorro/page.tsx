'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

export default function CalculadoraAhorroPage() {
  const [consumo, setConsumo] = useState(250)
  const [potencia, setPotencia] = useState(4.6)
  const [tipoTarifa, setTipoTarifa] = useState('PVPC')
  const [horasValle, setHorasValle] = useState(8)
  const [precioActual, setPrecioActual] = useState(0.14)
  const [resultado, setResultado] = useState<number | null>(null)

  const calcularAhorro = () => {
    // Este es un cálculo simplificado. En una implementación real, se usarían datos más precisos y fórmulas más complejas.
    const consumoAnual = consumo * 12
    const costoActual = consumoAnual * precioActual + potencia * 12 * 30 // Suponiendo un término de potencia de 30€/kW/año

    let costoEstimado
    if (tipoTarifa === 'PVPC') {
      costoEstimado = consumoAnual * 0.12 + potencia * 12 * 28 // Suponiendo un precio medio de PVPC de 0.12€/kWh
    } else {
      const consumoValle = consumoAnual * (horasValle / 24)
      const consumoPunta = consumoAnual - consumoValle
      costoEstimado = consumoValle * 0.08 + consumoPunta * 0.16 + potencia * 12 * 28 // Precios ejemplo para tarifa con discriminación horaria
    }

    const ahorroAnual = costoActual - costoEstimado
    setResultado(ahorroAnual)
  }

  return (
    <div className='container py-12'>
      <h1 className='text-3xl font-bold mb-6'>Calculadora de Ahorro</h1>
      <Card>
        <CardHeader>
          <CardTitle>Introduce tus datos de consumo</CardTitle>
          <CardDescription>
            Cuanto más precisos sean los datos, más exacto será el cálculo del ahorro potencial.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='consumo'>Consumo mensual (kWh)</Label>
            <Slider
              id='consumo'
              min={50}
              max={1000}
              step={10}
              value={[consumo]}
              onValueChange={(value) => setConsumo(value[0])}
            />
            <div className='text-right text-sm text-muted-foreground'>{consumo} kWh</div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='potencia'>Potencia contratada (kW)</Label>
            <Select
              value={potencia.toString()}
              onValueChange={(value) => setPotencia(Number.parseFloat(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona la potencia' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='3.45'>3.45 kW</SelectItem>
                <SelectItem value='4.6'>4.6 kW</SelectItem>
                <SelectItem value='5.75'>5.75 kW</SelectItem>
                <SelectItem value='6.9'>6.9 kW</SelectItem>
                <SelectItem value='8.05'>8.05 kW</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='tipoTarifa'>Tipo de tarifa</Label>
            <Select value={tipoTarifa} onValueChange={setTipoTarifa}>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona el tipo de tarifa' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PVPC'>PVPC</SelectItem>
                <SelectItem value='Discriminacion'>Con discriminación horaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {tipoTarifa === 'Discriminacion' && (
            <div className='space-y-2'>
              <Label htmlFor='horasValle'>Horas valle al día</Label>
              <Slider
                id='horasValle'
                min={0}
                max={24}
                step={1}
                value={[horasValle]}
                onValueChange={(value) => setHorasValle(value[0])}
              />
              <div className='text-right text-sm text-muted-foreground'>{horasValle} horas</div>
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='precioActual'>Precio actual por kWh (€)</Label>
            <Input
              id='precioActual'
              type='number'
              step='0.01'
              value={precioActual}
              onChange={(e) => setPrecioActual(Number.parseFloat(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calcularAhorro} className='w-full'>
            Calcular Ahorro
          </Button>
        </CardFooter>
      </Card>
      {resultado !== null && (
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Resultado del cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-green-600'>
              Ahorro anual estimado: {resultado.toFixed(2)}€
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Este es un cálculo aproximado basado en los datos proporcionados y las tarifas
              promedio del mercado. El ahorro real puede variar dependiendo de diversos factores.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
