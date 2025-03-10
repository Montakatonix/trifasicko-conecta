import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Euro, Users, Zap, Leaf } from "lucide-react"

export const metadata: Metadata = {
  title: "Nuestro Impacto | Trifasicko Conecta",
  description:
    "Descubre el impacto positivo que Trifasicko Conecta ha tenido en el ahorro de nuestros usuarios y en el medio ambiente.",
}

const impactStats = [
  {
    title: "Ahorro Total",
    value: "€2,500,000",
    description: "ahorrados por nuestros usuarios",
    icon: Euro,
  },
  {
    title: "Usuarios Ayudados",
    value: "50,000+",
    description: "han encontrado mejores tarifas",
    icon: Users,
  },
  {
    title: "Energía Ahorrada",
    value: "1,000,000 kWh",
    description: "de consumo optimizado",
    icon: Zap,
  },
  {
    title: "Reducción de CO2",
    value: "500 toneladas",
    description: "de emisiones evitadas",
    icon: Leaf,
  },
]

export default function ImpactoPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Nuestro Impacto</h1>
      <p className="text-muted-foreground mb-8">
        En Trifasicko Conecta, nos enorgullece el impacto positivo que hemos tenido en la vida de nuestros usuarios y en
        el medio ambiente. Estos son algunos de nuestros logros hasta la fecha:
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {impactStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <stat.icon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Nuestro Compromiso</h2>
        <p className="text-muted-foreground mb-4">
          En Trifasicko Conecta, no solo nos preocupamos por el ahorro económico de nuestros usuarios, sino también por
          el impacto ambiental de nuestras acciones. Trabajamos constantemente para promover el uso de energías
          renovables y prácticas de consumo responsable.
        </p>
        <p className="text-muted-foreground">
          Nuestro objetivo es seguir creciendo y ayudando a más personas a optimizar su consumo energético,
          contribuyendo así a un futuro más sostenible para todos.
        </p>
      </div>
    </div>
  )
}

