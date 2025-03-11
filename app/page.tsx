import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, Wifi, Calculator, Users, Shield, Award } from 'lucide-react'

const features = [
  {
    title: "Comparador de Luz",
    description: "Encuentra la mejor tarifa eléctrica comparando ofertas de las principales compañías.",
    icon: Zap,
    href: "/comparador-luz"
  },
  {
    title: "Comparador de Internet",
    description: "Compara paquetes de fibra, móvil y TV para encontrar la mejor oferta.",
    icon: Wifi,
    href: "/comparador-internet"
  },
  {
    title: "Calculadora de Ahorro",
    description: "Calcula cuánto puedes ahorrar en tus facturas mensuales.",
    icon: Calculator,
    href: "/calculadora-ahorro"
  }
]

const benefits = [
  {
    title: "Comunidad Activa",
    description: "Únete a nuestra comunidad de usuarios y comparte experiencias.",
    icon: Users
  },
  {
    title: "Servicio Seguro",
    description: "Tus datos están protegidos con los más altos estándares de seguridad.",
    icon: Shield
  },
  {
    title: "Calidad Garantizada",
    description: "Trabajamos solo con proveedores de servicios verificados y confiables.",
    icon: Award
  }
]

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ahorra en tus facturas de
          <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"> luz e internet</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
          Compara las mejores ofertas y encuentra el plan perfecto para ti.
          Ahorra tiempo y dinero con nuestros comparadores especializados.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/comparador-luz">
            <Button size="lg">
              Comparar Tarifas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/calculadora-ahorro">
            <Button variant="outline" size="lg">
              Calcular Ahorro
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Herramientas profesionales para ayudarte a tomar la mejor decisión
          </p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="rounded-lg bg-muted/50 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Beneficios que nos distinguen
          </p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="bg-background">
              <CardHeader>
                <benefit.icon className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">{benefit.title}</CardTitle>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-primary p-8 text-primary-foreground">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Empieza a ahorrar hoy mismo
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Únete a los miles de usuarios que ya han encontrado las mejores tarifas
            para sus hogares y negocios.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/registro">
              <Button size="lg" variant="secondary">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                Contactar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
