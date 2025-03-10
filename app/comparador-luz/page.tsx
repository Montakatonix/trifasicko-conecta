"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Zap, AlertCircle, Info } from "lucide-react"
import { Image } from "@/components/ui/image"

// Datos de ejemplo para tarifas
const TARIFAS_LUZ = [
  { id: "tarifa1", nombre: "Tarifa Óptima", precio: 0.12, descuento: 10, compania: "EnergíaPlus" },
  { id: "tarifa2", nombre: "Tarifa Eco", precio: 0.13, descuento: 5, compania: "NaturalPower" },
  { id: "tarifa3", nombre: "Tarifa Estable", precio: 0.11, descuento: 8, compania: "ElectriCity" },
  { id: "tarifa4", nombre: "Tarifa Ahorro", precio: 0.1, descuento: 12, compania: "EcoEnergía" },
  { id: "tarifa5", nombre: "Tarifa Hogar", precio: 0.14, descuento: 15, compania: "PowerHome" },
]

interface FormData {
  potenciaContratada: string
  consumoMensual: string
  tarifaActual: string
  companiaActual: string
}

interface Resultado {
  id: string
  nombre: string
  precio: number
  descuento: number
  compania: string
  ahorroAnual: number
  precioMensual: number
}

export default function ComparadorLuzPage() {
  const [formData, setFormData] = useState<FormData>({
    potenciaContratada: "",
    consumoMensual: "",
    tarifaActual: "",
    companiaActual: "",
  })
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calcularResultados = () => {
    setError(null)

    // Validar datos
    if (!formData.potenciaContratada || !formData.consumoMensual || !formData.tarifaActual) {
      setError("Por favor, completa todos los campos obligatorios")
      return
    }

    const potencia = Number.parseFloat(formData.potenciaContratada)
    const consumo = Number.parseFloat(formData.consumoMensual)
    const tarifaActual = Number.parseFloat(formData.tarifaActual)

    if (isNaN(potencia) || isNaN(consumo) || isNaN(tarifaActual)) {
      setError("Por favor, introduce valores numéricos válidos")
      return
    }

    // Calcular resultados
    setLoading(true)

    try {
      // Simulamos un cálculo de resultados basado en los datos de ejemplo
      const resultadosCalculados = TARIFAS_LUZ.map((tarifa) => {
        const precioMensual = consumo * tarifa.precio + potencia * 3.5
        const precioActualMensual = consumo * tarifaActual + potencia * 3.5
        const ahorroMensual = precioActualMensual - precioMensual
        const ahorroAnual = ahorroMensual * 12

        return {
          ...tarifa,
          ahorroAnual,
          precioMensual,
        }
      }).sort((a, b) => b.ahorroAnual - a.ahorroAnual)

      setResultados(resultadosCalculados)
    } catch (err) {
      console.error(err)
      setError("Error al calcular los resultados. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const guardarComparacion = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!tarifaSeleccionada) {
      setError("Por favor, selecciona una tarifa para guardar")
      return
    }

    try {
      setLoading(true)

      const tarifaElegida = resultados.find((r) => r.id === tarifaSeleccionada)

      if (!tarifaElegida) {
        throw new Error("Tarifa no encontrada")
      }

      await addDoc(collection(db, "usuarios", user.uid, "comparaciones"), {
        tipo: "luz",
        datosEntrada: formData,
        tarifaElegida,
        resultados,
        fechaCreacion: serverTimestamp(),
      })

      setSuccess("Comparación guardada correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error(err)
      setError("Error al guardar la comparación. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Comparador de Tarifas de Luz</h1>
          <p className="text-muted-foreground">
            Introduce tus datos de consumo y te mostraremos las mejores ofertas disponibles
          </p>
        </div>

        <div className="mb-8">
          <Image
            src="/images/electricity-comparison.jpg"
            width={800}
            height={400}
            alt="Comparación de tarifas de luz"
            className="rounded-xl shadow-lg"
          />
        </div>

        <Tabs defaultValue="comparar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparar">Comparar Tarifas</TabsTrigger>
            <TabsTrigger value="resultados" disabled={resultados.length === 0}>
              Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparar">
            <Card>
              <CardHeader>
                <CardTitle>Datos de consumo</CardTitle>
                <CardDescription>Introduce los datos de tu consumo actual para poder comparar tarifas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="potenciaContratada">Potencia contratada (kW) *</Label>
                    <Input
                      id="potenciaContratada"
                      name="potenciaContratada"
                      type="number"
                      step="0.1"
                      placeholder="Ej: 3.45"
                      value={formData.potenciaContratada}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consumoMensual">Consumo mensual (kWh) *</Label>
                    <Input
                      id="consumoMensual"
                      name="consumoMensual"
                      type="number"
                      placeholder="Ej: 250"
                      value={formData.consumoMensual}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tarifaActual">Precio actual por kWh (€) *</Label>
                    <Input
                      id="tarifaActual"
                      name="tarifaActual"
                      type="number"
                      step="0.01"
                      placeholder="Ej: 0.14"
                      value={formData.tarifaActual}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companiaActual">Compañía actual</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("companiaActual", value)}
                      value={formData.companiaActual}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu compañía actual" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iberdrola">Iberdrola</SelectItem>
                        <SelectItem value="endesa">Endesa</SelectItem>
                        <SelectItem value="naturgy">Naturgy</SelectItem>
                        <SelectItem value="repsol">Repsol</SelectItem>
                        <SelectItem value="otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Los campos marcados con * son obligatorios. Puedes encontrar estos datos en tu última factura de
                    luz.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button onClick={calcularResultados} className="w-full" disabled={loading}>
                  {loading ? "Calculando..." : "Comparar Tarifas"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resultados">
            <Card>
              <CardHeader>
                <CardTitle>Resultados de la comparación</CardTitle>
                <CardDescription>Estas son las mejores tarifas disponibles según tu consumo</CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <AlertTitle>¡Éxito!</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {resultados.map((resultado) => (
                    <Card
                      key={resultado.id}
                      className={`border-2 ${tarifaSeleccionada === resultado.id ? "border-primary" : "border-border"}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>{resultado.nombre}</CardTitle>
                            <CardDescription>{resultado.compania}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{resultado.precio.toFixed(4)} €/kWh</div>
                            <div className="text-sm text-green-600 font-medium">
                              {resultado.descuento}% de descuento
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <span>Precio mensual estimado:</span>
                          </div>
                          <div className="font-bold">{resultado.precioMensual.toFixed(2)} €/mes</div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            <span>Ahorro anual estimado:</span>
                          </div>
                          <div className="font-bold text-green-600">{resultado.ahorroAnual.toFixed(2)} €/año</div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={tarifaSeleccionada === resultado.id ? "default" : "outline"}
                          className="w-full"
                          onClick={() => setTarifaSeleccionada(resultado.id)}
                        >
                          {tarifaSeleccionada === resultado.id ? "Seleccionada" : "Seleccionar"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button onClick={guardarComparacion} className="w-full" disabled={loading || !tarifaSeleccionada}>
                  {loading ? "Guardando..." : "Guardar Comparación"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {user ? "La comparación se guardará en tu perfil" : "Inicia sesión para guardar esta comparación"}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

