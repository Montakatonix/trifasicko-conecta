import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Wifi, Calculator, Clock, Shield, Award, ArrowRight, Home } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <Image
          src="/hero-image.png"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 text-white">
          <div className="max-w-3xl space-y-6 animate-fade-up">
            <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl">
              Tu conexión con el hogar perfecto
                </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Encuentra las mejores tarifas de luz, internet y tu próxima vivienda en un solo lugar
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="btn-primary">
                <Link href="/propiedades">Explorar propiedades</Link>
                  </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link href="/contacto">Contactar</Link>
                  </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Nuestros Servicios</h2>
            <p className="text-xl text-muted-foreground">
              Todo lo que necesitas para tu hogar en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4 card-hover animate-fade-up">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Venta de Viviendas</h3>
              <p className="text-muted-foreground">
                Encuentra tu hogar ideal entre nuestra selección de propiedades exclusivas
              </p>
              <Button asChild variant="link" className="p-0">
                <Link href="/propiedades" className="flex items-center">
                  Ver propiedades
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 card-hover animate-fade-up [animation-delay:200ms]">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Tarifas de Luz</h3>
              <p className="text-muted-foreground">
                Compara y encuentra la mejor tarifa de luz para tu hogar
              </p>
              <Button asChild variant="link" className="p-0">
                <Link href="/comparador-luz" className="flex items-center">
                  Comparar tarifas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 card-hover animate-fade-up [animation-delay:400ms]">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Internet</h3>
              <p className="text-muted-foreground">
                Descubre las mejores ofertas de internet para tu zona
              </p>
              <Button asChild variant="link" className="p-0">
                <Link href="/comparador-internet" className="flex items-center">
                  Ver ofertas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Propiedades Destacadas</h2>
              <p className="text-xl text-muted-foreground">
                Las mejores oportunidades seleccionadas para ti
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/propiedades">Ver todas</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Property Card 1 */}
            <Card className="overflow-hidden card-hover animate-fade-up">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/inmuebles/casa1-1.jpg"
                  alt="Villa moderna"
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Destacado
                </Badge>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">Villa moderna con vistas al mar</h3>
                  <p className="text-muted-foreground">Costa del Sol, Málaga</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">750.000 €</p>
                  <div className="flex space-x-4 text-muted-foreground">
                    <span>4 hab</span>
                    <span>3 baños</span>
                    <span>350 m²</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/propiedades">Ver detalles</Link>
                </Button>
              </div>
            </Card>

            {/* Featured Property Card 2 */}
            <Card className="overflow-hidden card-hover animate-fade-up [animation-delay:200ms]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/inmuebles/piso1-1.jpg"
                  alt="Ático de lujo"
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Destacado
                </Badge>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">Ático de lujo en el centro</h3>
                  <p className="text-muted-foreground">Centro, Madrid</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">495.000 €</p>
                  <div className="flex space-x-4 text-muted-foreground">
                    <span>3 hab</span>
                    <span>2 baños</span>
                    <span>180 m²</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/propiedades">Ver detalles</Link>
                </Button>
              </div>
            </Card>

            {/* CTA Card */}
            <Card className="flex flex-col justify-center p-8 text-center card-hover animate-fade-up [animation-delay:400ms]">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">¿Buscas más opciones?</h3>
                <p className="text-muted-foreground">
                  Explora nuestra amplia selección de propiedades y encuentra tu hogar ideal
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/propiedades">Ver todas las propiedades</Link>
                </Button>
            </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">¿Listo para encontrar tu hogar ideal?</h2>
            <p className="text-xl">
              Nuestro equipo de expertos está aquí para ayudarte a encontrar la propiedad perfecta
              y las mejores tarifas de servicios
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/propiedades">Explorar propiedades</Link>
                </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link href="/contacto">Contactar ahora</Link>
                </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
