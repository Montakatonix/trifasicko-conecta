import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Nuestros Socios | Trifasicko Conecta",
  description: "Conoce las compañías de energía e Internet con las que trabajamos para ofrecerte las mejores tarifas.",
}

const partners = [
  {
    name: "EnergíaPlus",
    description: "Proveedor líder de energía renovable",
    logo: "/placeholder.svg?height=100&width=200",
    type: "luz",
  },
  {
    name: "FibraRápida",
    description: "Especialistas en conexiones de fibra óptica de alta velocidad",
    logo: "/placeholder.svg?height=100&width=200",
    type: "internet",
  },
  {
    name: "EcoLuz",
    description: "Energía 100% verde para hogares y empresas",
    logo: "/placeholder.svg?height=100&width=200",
    type: "luz",
  },
  {
    name: "MegaNet",
    description: "Soluciones de Internet para áreas urbanas y rurales",
    logo: "/placeholder.svg?height=100&width=200",
    type: "internet",
  },
  {
    name: "PowerHome",
    description: "Tarifas adaptadas a cada hogar",
    logo: "/placeholder.svg?height=100&width=200",
    type: "luz",
  },
  {
    name: "VelocityConnect",
    description: "Internet de alta velocidad y baja latencia",
    logo: "/placeholder.svg?height=100&width=200",
    type: "internet",
  },
  // Añade más socios aquí...
]

export default function NuestrosSociosPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Nuestros Socios</h1>
      <p className="text-muted-foreground mb-8">
        Trabajamos con las mejores compañías de energía e Internet para ofrecerte una amplia gama de opciones y las
        tarifas más competitivas.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner, index) => (
          <Card key={index}>
            <CardHeader>
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={200}
                height={100}
                className="mb-4"
              />
              <CardTitle>{partner.name}</CardTitle>
              <CardDescription>{partner.type === "luz" ? "Energía" : "Internet"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{partner.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

