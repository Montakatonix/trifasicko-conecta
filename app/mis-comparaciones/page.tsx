"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Wifi, Trash2, AlertCircle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Comparacion {
  id: string
  tipo: "luz" | "internet"
  fechaCreacion: any
  tarifaElegida: any
  datosEntrada: any
}

export default function MisComparacionesPage() {
  const [comparaciones, setComparaciones] = useState<Comparacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const cargarComparaciones = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, "usuarios", user.uid, "comparaciones"), orderBy("fechaCreacion", "desc"))
        const querySnapshot = await getDocs(q)

        const comparacionesData: Comparacion[] = []
        querySnapshot.forEach((doc) => {
          comparacionesData.push({
            id: doc.id,
            ...doc.data(),
          } as Comparacion)
        })

        setComparaciones(comparacionesData)
      } catch (err) {
        console.error("Error al cargar comparaciones:", err)
        setError("Error al cargar tus comparaciones. Por favor, inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    cargarComparaciones()
  }, [user, router])

  const eliminarComparacion = async (id: string) => {
    if (!user) return

    try {
      setDeleteLoading(id)
      await deleteDoc(doc(db, "usuarios", user.uid, "comparaciones", id))
      setComparaciones((prev) => prev.filter((comp) => comp.id !== id))
    } catch (err) {
      console.error("Error al eliminar comparación:", err)
      setError("Error al eliminar la comparación. Por favor, inténtalo de nuevo.")
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatFecha = (timestamp: any) => {
    if (!timestamp) return "Fecha desconocida"

    try {
      const fecha = timestamp.toDate()
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(fecha)
    } catch (err) {
      return "Fecha inválida"
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Cargando tus comparaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Comparaciones</h1>
          <p className="text-muted-foreground">Revisa y gestiona tus comparaciones guardadas</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {comparaciones.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No tienes comparaciones guardadas</CardTitle>
              <CardDescription>
                Realiza una comparación de tarifas para guardarla y consultarla más tarde
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-4">
              <Button onClick={() => router.push("/comparador-luz")}>Comparar Luz</Button>
              <Button variant="outline" onClick={() => router.push("/comparador-internet")}>
                Comparar Internet
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="luz">Luz</TabsTrigger>
              <TabsTrigger value="internet">Internet</TabsTrigger>
            </TabsList>

            <TabsContent value="todas" className="space-y-4 mt-6">
              {comparaciones.map((comparacion) => (
                <ComparacionCard
                  key={comparacion.id}
                  comparacion={comparacion}
                  onDelete={eliminarComparacion}
                  deleteLoading={deleteLoading === comparacion.id}
                  formatFecha={formatFecha}
                />
              ))}
            </TabsContent>

            <TabsContent value="luz" className="space-y-4 mt-6">
              {comparaciones
                .filter((c) => c.tipo === "luz")
                .map((comparacion) => (
                  <ComparacionCard
                    key={comparacion.id}
                    comparacion={comparacion}
                    onDelete={eliminarComparacion}
                    deleteLoading={deleteLoading === comparacion.id}
                    formatFecha={formatFecha}
                  />
                ))}
            </TabsContent>

            <TabsContent value="internet" className="space-y-4 mt-6">
              {comparaciones
                .filter((c) => c.tipo === "internet")
                .map((comparacion) => (
                  <ComparacionCard
                    key={comparacion.id}
                    comparacion={comparacion}
                    onDelete={eliminarComparacion}
                    deleteLoading={deleteLoading === comparacion.id}
                    formatFecha={formatFecha}
                  />
                ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

interface ComparacionCardProps {
  comparacion: Comparacion
  onDelete: (id: string) => Promise<void>
  deleteLoading: boolean
  formatFecha: (timestamp: any) => string
}

function ComparacionCard({ comparacion, onDelete, deleteLoading, formatFecha }: ComparacionCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {comparacion.tipo === "luz" ? (
                <Zap className="h-5 w-5 text-primary" />
              ) : (
                <Wifi className="h-5 w-5 text-primary" />
              )}
              {comparacion.tarifaElegida.nombre}
            </CardTitle>
            <CardDescription>
              {comparacion.tarifaElegida.compania} - {formatFecha(comparacion.fechaCreacion)}
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar comparación?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta comparación?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(comparacion.id).then(() => setDialogOpen(false))
                  }}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {comparacion.tipo === "luz" ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio:</span>
                <span className="font-medium">{comparacion.tarifaElegida.precio.toFixed(4)} €/kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consumo mensual:</span>
                <span className="font-medium">{comparacion.datosEntrada.consumoMensual} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Potencia contratada:</span>
                <span className="font-medium">{comparacion.datosEntrada.potenciaContratada} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio mensual estimado:</span>
                <span className="font-medium">{comparacion.tarifaElegida.precioMensual.toFixed(2)} €/mes</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Ahorro anual estimado:</span>
                <span className="font-bold">{comparacion.tarifaElegida.ahorroAnual.toFixed(2)} €/año</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio:</span>
                <span className="font-medium">{comparacion.tarifaElegida.precio.toFixed(2)} €/mes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Velocidad:</span>
                <span className="font-medium">{comparacion.tarifaElegida.velocidad} Mb</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Servicios:</span>
                <span className="font-medium">
                  {[
                    comparacion.tarifaElegida.telefonia ? "Fijo" : null,
                    comparacion.tarifaElegida.movil ? "Móvil" : null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Solo Internet"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Permanencia:</span>
                <span className="font-medium">
                  {comparacion.tarifaElegida.permanencia > 0
                    ? `${comparacion.tarifaElegida.permanencia} meses`
                    : "Sin permanencia"}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Ahorro anual estimado:</span>
                <span className="font-bold">{comparacion.tarifaElegida.ahorroAnual.toFixed(2)} €/año</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (comparacion.tipo === "luz") {
              window.location.href = "/comparador-luz"
            } else {
              window.location.href = "/comparador-internet"
            }
          }}
        >
          Realizar nueva comparación
        </Button>
      </CardFooter>
    </Card>
  )
}

