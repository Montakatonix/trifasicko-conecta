import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Prensa | Trifasicko Conecta",
  description: "Noticias, menciones en medios y premios recibidos por Trifasicko Conecta.",
}

const pressItems = [
  {
    title: "Trifasicko Conecta gana el premio a la Mejor Startup de Energía 2023",
    source: "TechCrunch",
    date: "15 de Septiembre, 2023",
    description:
      "La plataforma de comparación de tarifas ha sido reconocida por su innovación en el sector energético.",
    logo: "/placeholder.svg?height=50&width=100",
    type: "premio",
  },
  {
    title: "Cómo ahorrar en tu factura de luz con Trifasicko Conecta",
    source: "El País",
    date: "3 de Agosto, 2023",
    description:
      "Entrevista con la CEO de Trifasicko Conecta sobre cómo los consumidores pueden reducir sus gastos energéticos.",
    logo: "/placeholder.svg?height=50&width=100",
    type: "articulo",
  },
  {
    title: "Trifasicko Conecta cierra una ronda de financiación de 5 millones de euros",
    source: "Expansión",
    date: "20 de Julio, 2023",
    description: "La startup española planea expandir sus servicios a otros países europeos con esta nueva inversión.",
    logo: "/placeholder.svg?height=50&width=100",
    type: "noticia",
  },
  // Añade más items de prensa aquí...
]

export default function PrensaPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Prensa</h1>
      <p className="text-muted-foreground mb-8">
        Descubre las últimas noticias, menciones en medios y premios recibidos por Trifasicko Conecta.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pressItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Image src={item.logo || "/placeholder.svg"} alt={item.source} width={100} height={50} />
                <Badge
                  variant={item.type === "premio" ? "default" : item.type === "articulo" ? "secondary" : "outline"}
                >
                  {item.type}
                </Badge>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.source} - {item.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

