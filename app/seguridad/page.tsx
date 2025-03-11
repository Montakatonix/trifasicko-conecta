'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { checkSecurityCoverage, fetchSecuritySystems } from '@/lib/services/security-service'
import type { SecurityCoverage, SistemaSeguridad } from '@/lib/types'

const codigoPostalSchema = z.object({
  codigoPostal: z.string().length(5, 'El código postal debe tener 5 dígitos'),
})

type FormValues = z.infer<typeof codigoPostalSchema>

export default function SeguridadPage() {
  const [sistemas, setSistemas] = useState<SistemaSeguridad[]>([])
  const [cobertura, setCobertura] = useState<SecurityCoverage | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(codigoPostalSchema),
  })

  useEffect(() => {
    async function loadSistemas() {
      try {
        const data = await fetchSecuritySystems()
        setSistemas(data)
      } catch (error) {
        console.error('Error cargando sistemas:', error)
      }
    }
    loadSistemas()
  }, [])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const data = await checkSecurityCoverage(values.codigoPostal)
      setCobertura(data)
    } catch (error) {
      console.error('Error verificando cobertura:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-8'>
      <h1 className='text-4xl font-bold mb-6'>Sistemas de Seguridad</h1>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Verifica la cobertura</CardTitle>
            <CardDescription>
              Introduce tu código postal para verificar la disponibilidad de instaladores en tu zona
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Input
                  {...form.register('codigoPostal')}
                  placeholder='28001'
                  className='w-full'
                  maxLength={5}
                />
                {form.formState.errors.codigoPostal && (
                  <p className='text-sm text-red-500 mt-1'>
                    {form.formState.errors.codigoPostal.message}
                  </p>
                )}
              </div>
              <Button type='submit' disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar cobertura'}
              </Button>
            </form>

            {cobertura && (
              <div className='mt-4'>
                <Separator className='my-4' />
                <h3 className='font-semibold mb-2'>Resultado:</h3>
                {cobertura.available ? (
                  <>
                    <p className='text-green-600 mb-2'>¡Tenemos cobertura en tu zona!</p>
                    <p>Tiempo estimado de instalación: {cobertura.estimatedInstallationTime}</p>
                    <h4 className='font-medium mt-4 mb-2'>Instaladores disponibles:</h4>
                    <ul className='space-y-2'>
                      {cobertura.installers.map((installer, index) => (
                        <li key={index} className='flex justify-between items-center'>
                          <span>{installer.name}</span>
                          <span className='text-sm text-muted-foreground'>
                            {installer.distance.toFixed(1)} km
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className='text-red-500'>
                    Lo sentimos, actualmente no tenemos cobertura en tu zona.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuestros sistemas</CardTitle>
            <CardDescription>
              Explora nuestra gama de sistemas de seguridad adaptados a tus necesidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='alarma'>
              <TabsList className='w-full'>
                <TabsTrigger value='alarma'>Alarmas</TabsTrigger>
                <TabsTrigger value='camara'>Cámaras</TabsTrigger>
                <TabsTrigger value='kit'>Kits</TabsTrigger>
                <TabsTrigger value='sensor'>Sensores</TabsTrigger>
              </TabsList>
              <div className='mt-4 grid gap-4'>
                {sistemas
                  .filter((sistema) => sistema.tipo === 'alarma')
                  .map((sistema) => (
                    <Card key={sistema.id}>
                      <CardHeader>
                        <CardTitle>{sistema.nombre}</CardTitle>
                        <CardDescription>{sistema.proveedor}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-2'>
                          <p>Precio: {sistema.precio}€</p>
                          <p>Cuota mensual: {sistema.cuotaMensual}€</p>
                          <ul className='list-disc list-inside'>
                            {sistema.caracteristicas.map((caracteristica, index) => (
                              <li key={index}>{caracteristica}</li>
                            ))}
                          </ul>
                          <Button className='w-full'>Ver detalles</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
