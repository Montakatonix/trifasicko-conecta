"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Shield, Camera, Package, Gauge } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { SistemaSeguridad } from "@/lib/types"
import { checkSecurityCoverage, fetchSecuritySystems } from "@/lib/services/security-service"

const codigoPostalSchema = z.object({
  codigoPostal: z.string().length(5, "El código postal debe tener 5 dígitos").regex(/^\d+$/, "Solo se permiten números")
})

export default function SeguridadPage() {
  const [sistemas, setSistemas] = useState<SistemaSeguridad[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [loading, setLoading] = useState(true)
  const [checkingCoverage, setCheckingCoverage] = useState(false)
  const [cobertura, setCobertura] = useState<{
    available: boolean
    installers: { name: string; phone: string; distance: number }[]
    estimatedInstallationTime: string
  } | null>(null)

  const form = useForm<z.infer<typeof codigoPostalSchema>>({
    resolver: zodResolver(codigoPostalSchema),
    defaultValues: {
      codigoPostal: ""
    }
  })

  useEffect(() => {
    const cargarSistemas = async () => {
      try {
        const data = await fetchSecuritySystems()
        setSistemas(data)
      } catch (error) {
        console.error("Error cargando sistemas de seguridad:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarSistemas()
  }, [])

  const onSubmit = async (values: z.infer<typeof codigoPostalSchema>) => {
    setCheckingCoverage(true)
    try {
      const data = await checkSecurityCoverage(values.codigoPostal)
      setCobertura(data)
    } catch (error) {
      console.error("Error verificando cobertura:", error)
    } finally {
      setCheckingCoverage(false)
    }
  }

  const sistemasFiltrados = filtroTipo === "todos" 
    ? sistemas 
    : sistemas.filter(sistema => sistema.tipo === filtroTipo)

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case "alarma":
        return <Shield className="h-5 w-5" />
      case "camara":
        return <Camera className="h-5 w-5" />
      case "kit":
        return <Package className="h-5 w-5" />
      case "sensor":
        return <Gauge className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Sistemas de Seguridad
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protege tu hogar o negocio con los mejores sistemas de seguridad del mercado
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div>
            <Tabs defaultValue="todos" className="tabs mb-8">
              <TabsList className="inline-flex p-1 gap-1 bg-muted rounded-lg">
                <TabsTrigger 
                  value="todos" 
                  onClick={() => setFiltroTipo("todos")}
                  className="tab px-4 py-2 rounded-md"
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger 
                  value="alarma" 
                  onClick={() => setFiltroTipo("alarma")}
                  className="tab px-4 py-2 rounded-md"
                >
                  Alarmas
                </TabsTrigger>
                <TabsTrigger 
                  value="camara" 
                  onClick={() => setFiltroTipo("camara")}
                  className="tab px-4 py-2 rounded-md"
                >
                  Cámaras
                </TabsTrigger>
                <TabsTrigger 
                  value="kit" 
                  onClick={() => setFiltroTipo("kit")}
                  className="tab px-4 py-2 rounded-md"
                >
                  Kits
                </TabsTrigger>
                <TabsTrigger 
                  value="sensor" 
                  onClick={() => setFiltroTipo("sensor")}
                  className="tab px-4 py-2 rounded-md"
                >
                  Sensores
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-gradient p-4 rounded-full">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {sistemasFiltrados.map((sistema) => (
                  <Card key={sistema.id} className="card overflow-hidden border-0">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getIconForType(sistema.tipo)}
                        </div>
                        <Badge className="badge">{sistema.tipo.toUpperCase()}</Badge>
                        <Badge variant="outline" className="ml-auto">
                          {sistema.proveedor}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl">{sistema.nombre}</CardTitle>
                      <CardDescription className="text-base">
                        {sistema.caracteristicas[0]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">Características principales</h4>
                        <ul className="grid gap-2">
                          {sistema.caracteristicas.map((caracteristica, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>{caracteristica}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-lg">Especificaciones</h4>
                        <dl className="grid grid-cols-2 gap-3">
                          {sistema.especificaciones?.conectividad && (
                            <>
                              <dt className="text-muted-foreground font-medium">Conectividad</dt>
                              <dd className="font-semibold">{sistema.especificaciones.conectividad.join(", ")}</dd>
                            </>
                          )}
                          {sistema.especificaciones?.alimentacion && (
                            <>
                              <dt className="text-muted-foreground font-medium">Alimentación</dt>
                              <dd className="font-semibold">{sistema.especificaciones.alimentacion}</dd>
                            </>
                          )}
                          {sistema.especificaciones?.sensores && (
                            <>
                              <dt className="text-muted-foreground font-medium">Sensores</dt>
                              <dd className="font-semibold">{sistema.especificaciones.sensores.join(", ")}</dd>
                            </>
                          )}
                        </dl>
                      </div>
                      <Separator className="my-6" />
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-primary">{sistema.precio}€</div>
                          <div className="text-sm text-muted-foreground mt-1">Equipo</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-primary">{sistema.precioInstalacion}€</div>
                          <div className="text-sm text-muted-foreground mt-1">Instalación</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-primary">{sistema.cuotaMensual}€</div>
                          <div className="text-sm text-muted-foreground mt-1">Mensual</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="button w-full text-lg py-6" asChild>
                        <a href={sistema.urlContratacion} target="_blank" rel="noopener noreferrer">
                          Contratar ahora
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8 self-start">
            <Card className="card border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Verificar cobertura</CardTitle>
                <CardDescription className="text-base">
                  Comprueba si hay disponibilidad de instalación en tu zona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="codigoPostal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Código postal</FormLabel>
                          <FormControl>
                            <Input placeholder="28001" className="input text-lg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Introduce el código postal de tu zona
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="button w-full" disabled={checkingCoverage}>
                      {checkingCoverage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verificar cobertura
                    </Button>
                  </form>
                </Form>

                {cobertura && (
                  <div className="mt-8 space-y-6">
                    <Separator />
                    <div>
                      <h4 className="text-xl font-semibold mb-4">Resultado</h4>
                      {cobertura.available ? (
                        <>
                          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-6">
                            <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                              ¡Hay cobertura en tu zona!
                            </p>
                            <p className="text-muted-foreground mt-2">
                              Tiempo estimado de instalación: {cobertura.estimatedInstallationTime}
                            </p>
                          </div>
                          {cobertura.installers.length > 0 && (
                            <div>
                              <h5 className="font-medium text-lg mb-4">Instaladores disponibles:</h5>
                              <div className="space-y-4">
                                {cobertura.installers.map((installer, index) => (
                                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                                    <p className="font-semibold text-primary">{installer.name}</p>
                                    <p className="text-muted-foreground mt-2">
                                      Tel: {installer.phone}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      A {installer.distance}km de tu ubicación
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-destructive font-semibold">
                            Lo sentimos, actualmente no hay cobertura en tu zona.
                          </p>
                          <p className="text-muted-foreground mt-2">
                            Contacta con nosotros para más información.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 