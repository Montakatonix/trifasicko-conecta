"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import type { TarifaLuz, ConsumoElectrico, Electrodomestico } from "@/lib/types"
import { calcularCosteLuz, calcularPotenciaRecomendada, formatearPrecio, validarCUPS } from "@/lib/utils"
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
import { Loader2, Zap, Info, AlertCircle, CheckCircle } from "lucide-react"

// Lista de electrodomésticos comunes con sus potencias
const electrodomesticosComunes: Electrodomestico[] = [
  { nombre: "Frigorífico", potencia: 0.35, uso: "simultaneo" },
  { nombre: "Lavadora", potencia: 2.2, uso: "individual" },
  { nombre: "Lavavajillas", potencia: 2.0, uso: "individual" },
  { nombre: "Horno", potencia: 2.2, uso: "individual" },
  { nombre: "Vitrocerámica", potencia: 2.0, uso: "individual" },
  { nombre: "Microondas", potencia: 1.0, uso: "individual" },
  { nombre: "Aire acondicionado", potencia: 1.5, uso: "simultaneo" },
  { nombre: "Calefacción eléctrica", potencia: 2.0, uso: "simultaneo" },
  { nombre: "Televisión", potencia: 0.2, uso: "simultaneo" },
  { nombre: "Iluminación", potencia: 0.5, uso: "simultaneo" }
]

export default function ComparadorLuzPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("consumo")
  const [resultados, setResultados] = useState<TarifaLuz[]>([])
  const [electrodomesticosSeleccionados, setElectrodomesticosSeleccionados] = useState<string[]>([])
  
  const [consumo, setConsumo] = useState<ConsumoElectrico>({
    consumoMensual: 0,
    potenciaContratada: 0,
    discriminacionHoraria: false,
    consumoPunta: 0,
    consumoValle: 0
  })

  const handleElectrodomesticoChange = (checked: boolean, nombre: string) => {
    if (checked) {
      setElectrodomesticosSeleccionados([...electrodomesticosSeleccionados, nombre])
    } else {
      setElectrodomesticosSeleccionados(electrodomesticosSeleccionados.filter(e => e !== nombre))
    }

    // Calcular potencia recomendada
    const electrodomesticosActivos = electrodomesticosComunes.filter(e => 
      checked ? [...electrodomesticosSeleccionados, nombre].includes(e.nombre) 
             : electrodomesticosSeleccionados.filter(selected => selected !== nombre).includes(e.nombre)
    )
    const potenciaRecomendada = calcularPotenciaRecomendada(electrodomesticosActivos)
    
    setConsumo(prev => ({
      ...prev,
      potenciaContratada: potenciaRecomendada
    }))
  }

  const handleConsumoChange = (field: keyof ConsumoElectrico, value: number | boolean) => {
    setConsumo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Aquí iría la llamada a la API para obtener tarifas
      // Por ahora usamos datos de ejemplo
      const tarifasEjemplo: TarifaLuz[] = [
        {
          id: "1",
          comercializadora: "Iberdrola",
          nombre: "Plan Estable",
          tipo: "fijo",
          precioKwhPunta: 0.15,
          precioKwhValle: 0.08,
          potenciaContratada: consumo.potenciaContratada,
          permanencia: 12,
          caracteristicas: ["Precio fijo garantizado", "Energía 100% renovable"],
          urlContratacion: "https://iberdrola.es",
          logoUrl: "/logos/iberdrola.png"
        },
        {
          id: "2",
          comercializadora: "Endesa",
          nombre: "One Luz",
          tipo: "fijo",
          precioKwhPunta: 0.14,
          precioKwhValle: 0.07,
          potenciaContratada: consumo.potenciaContratada,
          permanencia: 0,
          caracteristicas: ["Sin permanencia", "App de control"],
          urlContratacion: "https://endesa.es",
          logoUrl: "/logos/endesa.png"
        }
      ]

      // Guardar la comparación si el usuario está autenticado
      if (user) {
        await addDoc(collection(db, "comparaciones"), {
          userId: user.uid,
          tipo: "luz",
          consumo,
          electrodomesticos: electrodomesticosSeleccionados,
          createdAt: serverTimestamp()
        })
      }

      setResultados(tarifasEjemplo)
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
      <h1 className="text-4xl font-bold mb-6">Comparador de Tarifas de Luz</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="consumo">1. Tu Consumo</TabsTrigger>
          <TabsTrigger value="electrodomesticos">2. Electrodomésticos</TabsTrigger>
          <TabsTrigger value="resultados" disabled={resultados.length === 0}>
            3. Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consumo">
          <Card>
            <CardHeader>
              <CardTitle>Datos de consumo</CardTitle>
              <CardDescription>
                Introduce los datos de tu consumo eléctrico para encontrar la mejor tarifa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Consumo mensual (kWh)</Label>
                    <Input
                      type="number"
                      value={consumo.consumoMensual}
                      onChange={(e) => handleConsumoChange("consumoMensual", Number(e.target.value))}
                      min="0"
                      step="1"
                    />
                  </div>

                  <div>
                    <Label>Potencia contratada (kW)</Label>
                    <Input
                      type="number"
                      value={consumo.potenciaContratada}
                      onChange={(e) => handleConsumoChange("potenciaContratada", Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={consumo.discriminacionHoraria}
                      onCheckedChange={(checked) => handleConsumoChange("discriminacionHoraria", checked)}
                    />
                    <Label>¿Tienes discriminación horaria?</Label>
                  </div>

                  {consumo.discriminacionHoraria && (
                    <div className="space-y-4">
                      <div>
                        <Label>Consumo en hora punta (kWh)</Label>
                        <Input
                          type="number"
                          value={consumo.consumoPunta}
                          onChange={(e) => handleConsumoChange("consumoPunta", Number(e.target.value))}
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <Label>Consumo en hora valle (kWh)</Label>
                        <Input
                          type="number"
                          value={consumo.consumoValle}
                          onChange={(e) => handleConsumoChange("consumoValle", Number(e.target.value))}
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button type="button" onClick={() => setActiveTab("electrodomesticos")}>
                  Siguiente
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electrodomesticos">
          <Card>
            <CardHeader>
              <CardTitle>Tus electrodomésticos</CardTitle>
              <CardDescription>
                Selecciona los electrodomésticos que tienes en casa para calcular la potencia recomendada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {electrodomesticosComunes.map((electrodomestico) => (
                  <div key={electrodomestico.nombre} className="flex items-center space-x-2">
                    <Checkbox
                      checked={electrodomesticosSeleccionados.includes(electrodomestico.nombre)}
                      onCheckedChange={(checked) => 
                        handleElectrodomesticoChange(checked as boolean, electrodomestico.nombre)
                      }
                    />
                    <Label>
                      {electrodomestico.nombre} ({electrodomestico.potencia}kW)
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Potencia recomendada: {consumo.potenciaContratada}kW
                  </AlertDescription>
                </Alert>
              </div>

              <div className="mt-6 space-x-4">
                <Button variant="outline" onClick={() => setActiveTab("consumo")}>
                  Anterior
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparando tarifas...
                    </>
                  ) : (
                    "Comparar tarifas"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resultados.map((tarifa) => (
              <Card key={tarifa.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{tarifa.comercializadora} - {tarifa.nombre}</CardTitle>
                      <CardDescription>
                        {tarifa.tipo === "fijo" ? "Precio fijo" : "Precio indexado"}
                      </CardDescription>
                    </div>
                    <img
                      src={tarifa.logoUrl}
                      alt={tarifa.comercializadora}
                      className="h-12 w-auto"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Precios</h4>
                      <ul className="space-y-2">
                        <li>Hora punta: {formatearPrecio(tarifa.precioKwhPunta)}/kWh</li>
                        <li>Hora valle: {formatearPrecio(tarifa.precioKwhValle)}/kWh</li>
                        <li>Potencia: {tarifa.potenciaContratada}kW</li>
                      </ul>
                    </div>
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
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Coste mensual estimado</h4>
                    <div className="text-2xl font-bold text-primary">
                      {formatearPrecio(calcularCosteLuz(tarifa, consumo))}
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
            ))}

            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => setActiveTab("consumo")}>
                Nueva comparación
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

