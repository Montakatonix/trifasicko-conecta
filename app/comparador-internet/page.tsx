"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import type { TarifaInternet, FiltrosInternet } from "@/lib/types"
import { filtrarTarifasInternet, ordenarTarifasPorPrecio, formatearPrecio, validarCodigoPostal } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Wifi, Info, AlertCircle, CheckCircle } from "lucide-react"

export default function ComparadorInternetPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("requisitos")
  const [resultados, setResultados] = useState<TarifaInternet[]>([])
  
  const [filtros, setFiltros] = useState<FiltrosInternet>({
    velocidadMinima: 100,
    tipoConexion: "fibra",
    precioMaximo: 100,
    sinPermanencia: false,
    codigoPostal: ""
  })

  const handleFiltrosChange = (field: keyof FiltrosInternet, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (!filtros.codigoPostal) {
      setError("Por favor, introduce tu código postal")
      return
    }

    if (!validarCodigoPostal(filtros.codigoPostal)) {
      setError("El código postal no es válido")
      return
    }

    try {
      setLoading(true)

      // Aquí iría la llamada a la API para obtener tarifas
      // Por ahora usamos datos de ejemplo
      const tarifasEjemplo: TarifaInternet[] = [
        {
          id: "1",
          operador: "Movistar",
          nombre: "Fibra 1000Mb",
          velocidadBajada: 1000,
          velocidadSubida: 1000,
          tipo: "fibra",
          precio: 39.90,
          permanencia: 12,
          caracteristicas: [
            "Router WiFi 6",
            "Instalación gratuita",
            "Línea fija incluida"
          ],
          extras: ["TV con deco 4K", "Apps premium"],
          urlContratacion: "https://movistar.es",
          logoUrl: "/logos/movistar.png",
          cobertura: ["28001", "28002", "28003"]
        },
        {
          id: "2",
          operador: "Orange",
          nombre: "Love Fibra 500Mb",
          velocidadBajada: 500,
          velocidadSubida: 500,
          tipo: "fibra",
          precio: 34.95,
          permanencia: 0,
          caracteristicas: [
            "Sin permanencia",
            "Router última generación",
            "Llamadas ilimitadas"
          ],
          urlContratacion: "https://orange.es",
          logoUrl: "/logos/orange.png",
          cobertura: ["28001", "28002", "28003"]
        }
      ]

      // Filtrar y ordenar resultados
      const tarifasFiltradas = filtrarTarifasInternet(tarifasEjemplo, filtros)
      const tarifasOrdenadas = ordenarTarifasPorPrecio(tarifasFiltradas)

      // Guardar la búsqueda si el usuario está autenticado
      if (user) {
        await addDoc(collection(db, "comparaciones"), {
          userId: user.uid,
          tipo: "internet",
          filtros,
          createdAt: serverTimestamp()
        })
      }

      setResultados(tarifasOrdenadas)
      setActiveTab("resultados")
    } catch (error) {
      setError("Error al obtener las tarifas. Por favor, inténtalo de nuevo.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Comparador de Tarifas de Internet</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requisitos">1. Tus Requisitos</TabsTrigger>
          <TabsTrigger value="resultados" disabled={resultados.length === 0}>
            2. Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requisitos">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué tipo de conexión necesitas?</CardTitle>
              <CardDescription>
                Cuéntanos tus necesidades para encontrar la mejor tarifa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Código Postal</Label>
                    <Input
                      type="text"
                      maxLength={5}
                      value={filtros.codigoPostal}
                      onChange={(e) => handleFiltrosChange("codigoPostal", e.target.value)}
                      placeholder="28001"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label>Velocidad mínima (Mb)</Label>
                    <Select
                      value={String(filtros.velocidadMinima)}
                      onValueChange={(value) => handleFiltrosChange("velocidadMinima", Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Mb</SelectItem>
                        <SelectItem value="300">300 Mb</SelectItem>
                        <SelectItem value="500">500 Mb</SelectItem>
                        <SelectItem value="1000">1 Gb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tipo de conexión</Label>
                    <Select
                      value={filtros.tipoConexion}
                      onValueChange={(value) => handleFiltrosChange("tipoConexion", value as "fibra" | "adsl" | "movil")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fibra">Fibra Óptica</SelectItem>
                        <SelectItem value="adsl">ADSL</SelectItem>
                        <SelectItem value="movil">Internet Móvil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Precio máximo mensual</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[filtros.precioMaximo]}
                        onValueChange={([value]) => handleFiltrosChange("precioMaximo", value)}
                        max={150}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-16 text-right">{filtros.precioMaximo}€</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filtros.sinPermanencia}
                      onCheckedChange={(checked) => handleFiltrosChange("sinPermanencia", checked)}
                    />
                    <Label>Solo ofertas sin permanencia</Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando tarifas...
                      </>
                    ) : (
                      "Buscar tarifas"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados">
          <div className="space-y-6">
            {resultados.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No se encontraron tarifas que coincidan con tus criterios. 
                  Prueba a ajustar los filtros.
                </AlertDescription>
              </Alert>
            ) : (
              resultados.map((tarifa) => (
                <Card key={tarifa.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{tarifa.operador} - {tarifa.nombre}</CardTitle>
                        <CardDescription>
                          {tarifa.velocidadBajada}Mb ↓ {tarifa.velocidadSubida}Mb ↑
                        </CardDescription>
                      </div>
                      <img
                        src={tarifa.logoUrl}
                        alt={tarifa.operador}
                        className="h-12 w-auto"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Características</h4>
                        <ul className="space-y-2">
                          {tarifa.caracteristicas.map((caracteristica, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              {caracteristica}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {tarifa.extras && (
                        <div>
                          <h4 className="font-semibold mb-2">Extras incluidos</h4>
                          <ul className="space-y-2">
                            {tarifa.extras.map((extra, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                                {extra}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Precio mensual</h4>
                      <div className="text-2xl font-bold text-primary">
                        {formatearPrecio(tarifa.precio)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {tarifa.permanencia > 0 
                        ? `Permanencia: ${tarifa.permanencia} meses`
                        : "Sin permanencia"}
                    </p>
                    <Button asChild>
                      <a href={tarifa.urlContratacion} target="_blank" rel="noopener noreferrer">
                        Contratar
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}

            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => setActiveTab("requisitos")}>
                Nueva comparación
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

