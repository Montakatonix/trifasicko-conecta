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
import { Checkbox } from "@/components/ui/checkbox"
import { Wifi, AlertCircle, Info, PhoneCall, Smartphone } from "lucide-react"
import { Image } from "@/components/ui/image"

// Datos de ejemplo para tarifas
const TARIFAS_INTERNET = [
  {
    id: "internet1",
    nombre: "Fibra 300Mb",
    velocidad: 300,
    precio: 29.99,
    descuento: 10,
    compania: "FibraMax",
    telefonia: true,
    movil: false,
    permanencia: 12,
  },
  {
    id: "internet2",
    nombre: "Fibra 600Mb + Móvil",
    velocidad: 600,
    precio: 39.99,
    descuento: 15,
    compania: "TeleConnect",
    telefonia: true,
    movil: true,
    permanencia: 12,
  },
  {
    id: "internet3",
    nombre: "Fibra 1Gb",
    velocidad: 1000,
    precio: 49.99,
    descuento: 20,
    compania: "SpeedNet",
    telefonia: true,
    movil: false,
    permanencia: 0,
  },
  {
    id: "internet4",
    nombre: "Fibra 600Mb",
    velocidad: 600,
    precio: 34.99,
    descuento: 5,
    compania: "NetFast",
    telefonia: false,
    movil: false,
    permanencia: 0,
  },
  {
    id: "internet5",
    nombre: "Fibra 1Gb + Móvil Ilimitado",
    velocidad: 1000,
    precio: 59.99,
    descuento: 25,
    compania: "MegaConnect",
    telefonia: true,
    movil: true,
    permanencia: 18,
  },
]

interface FormData {
  codigoPostal: string
  velocidadActual: string
  precioActual: string
  companiaActual: string
  quiereTelefonia: boolean
  quiereMovil: boolean
  aceptaPermanencia: boolean
}

interface Resultado {
  id: string
  nombre: string
  velocidad: number
  precio: number
  descuento: number
  compania: string
  telefonia: boolean
  movil: boolean
  permanencia: number
  ahorroAnual: number
}

export default function ComparadorInternetPage() {
  const [formData, setFormData] = useState<FormData>({
    codigoPostal: "",
    velocidadActual: "",
    precioActual: "",
    companiaActual: "",
    quiereTelefonia: false,
    quiereMovil: false,
    aceptaPermanencia: true,
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const calcularResultados = () => {
    setError(null)

    // Validar datos
    if (!formData.codigoPostal || !formData.precioActual) {
      setError("Por favor, completa todos los campos obligatorios")
      return
    }

    const codigoPostal = formData.codigoPostal
    const precioActual = Number.parseFloat(formData.precioActual)

    if (isNaN(precioActual)) {
      setError("Por favor, introduce un precio válido")
      return
    }

    // Validar código postal
    if (codigoPostal.length !== 5 || !/^\d+$/.test(codigoPostal)) {
      setError("Por favor, introduce un código postal válido")
      return
    }

    // Calcular resultados
    setLoading(true)

    try {
      // Filtrar tarifas según preferencias
      let tarifasFiltradas = [...TARIFAS_INTERNET]

      if (!formData.aceptaPermanencia) {
        tarifasFiltradas = tarifasFiltradas.filter((t) => t.permanencia === 0)
      }

      if (formData.quiereTelefonia) {
        tarifasFiltradas = tarifasFiltradas.filter((t) => t.telefonia)
      }

      if (formData.quiereMovil) {
        tarifasFiltradas = tarifasFiltradas.filter((t) => t.movil)
      }

      // Calcular ahorro
      const resultadosCalculados = tarifasFiltradas
        .map((tarifa) => {
          const ahorroMensual = precioActual - tarifa.precio
          const ahorroAnual = ahorroMensual * 12

          return {
            ...tarifa,
            ahorroAnual,
          }
        })
        .sort((a, b) => b.ahorroAnual - a.ahorroAnual)

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
        tipo: "internet",
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
          <h1 className="text-3xl font-bold mb-2">Comparador de Tarifas de Internet</h1>
          <p className="text-muted-foreground">Encuentra la mejor oferta de fibra y ADSL para tu hogar</p>
        </div>

        <div className="mb-8">
          <Image
            src="/images/internet-comparison.jpg"
            width={800}
            height={400}
            alt="Comparación de tarifas de internet"
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
                <CardTitle>Datos de tu conexión actual</CardTitle>
                <CardDescription>Introduce los datos de tu conexión actual para poder comparar tarifas</CardDescription>
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
                    <Label htmlFor="codigoPostal">Código postal *</Label>
                    <Input
                      id="codigoPostal"
                      name="codigoPostal"
                      placeholder="Ej: 28001"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="velocidadActual">Velocidad actual (Mb)</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("velocidadActual", value)}
                      value={formData.velocidadActual}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu velocidad actual" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Mb</SelectItem>
                        <SelectItem value="300">300 Mb</SelectItem>
                        <SelectItem value="600">600 Mb</SelectItem>
                        <SelectItem value="1000">1 Gb</SelectItem>
                        <SelectItem value="adsl">ADSL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precioActual">Precio actual (€/mes) *</Label>
                    <Input
                      id="precioActual"
                      name="precioActual"
                      type="number"
                      step="0.01"
                      placeholder="Ej: 39.99"
                      value={formData.precioActual}
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
                        <SelectItem value="movistar">Movistar</SelectItem>
                        <SelectItem value="vodafone">Vodafone</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="masmovil">MásMóvil</SelectItem>
                        <SelectItem value="otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="font-medium">¿Qué servicios necesitas?</h3>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quiereTelefonia"
                      checked={formData.quiereTelefonia}
                      onCheckedChange={(checked) => handleCheckboxChange("quiereTelefonia", checked as boolean)}
                    />
                    <Label htmlFor="quiereTelefonia" className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4" />
                      Telefonía fija
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quiereMovil"
                      checked={formData.quiereMovil}
                      onCheckedChange={(checked) => handleCheckboxChange("quiereMovil", checked as boolean)}
                    />
                    <Label htmlFor="quiereMovil" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Línea móvil
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aceptaPermanencia"
                      checked={formData.aceptaPermanencia}
                      onCheckedChange={(checked) => handleCheckboxChange("aceptaPermanencia", checked as boolean)}
                    />
                    <Label htmlFor="aceptaPermanencia">Acepto ofertas con permanencia</Label>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Los campos marcados con * son obligatorios. Puedes encontrar estos datos en tu última factura de
                    Internet.
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
                <CardDescription>Estas son las mejores tarifas disponibles según tus preferencias</CardDescription>
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
                            <div className="text-2xl font-bold">{resultado.precio.toFixed(2)} €/mes</div>
                            <div className="text-sm text-green-600 font-medium">
                              {resultado.descuento}% de descuento
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-primary" />
                            <span>Velocidad:</span>
                          </div>
                          <div className="font-bold">{resultado.velocidad} Mb</div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-muted-foreground" />
                            <span>Servicios incluidos:</span>
                          </div>
                          <div className="flex gap-2">
                            {resultado.telefonia && (
                              <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded-md">
                                <PhoneCall className="h-4 w-4" />
                                <span>Fijo</span>
                              </div>
                            )}
                            {resultado.movil && (
                              <div className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded-md">
                                <Smartphone className="h-4 w-4" />
                                <span>Móvil</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-muted-foreground" />
                            <span>Permanencia:</span>
                          </div>
                          <div className="font-medium">
                            {resultado.permanencia > 0 ? `${resultado.permanencia} meses` : "Sin permanencia"}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-green-600" />
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

