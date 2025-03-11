import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Wifi, Calculator, Clock, Shield, Award } from 'lucide-react'

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold">
          Encuentra las mejores tarifas de luz e internet
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Compara y ahorra en tus facturas mensuales con Trifasicko Conecta
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/comparador-luz">
            <Button size="lg">
              <Zap className="mr-2 h-5 w-5" />
              Comparar tarifas de luz
            </Button>
          </Link>
          <Link href="/comparador-internet">
            <Button size="lg" variant="outline">
              <Wifi className="mr-2 h-5 w-5" />
              Comparar tarifas de internet
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">
          ¿Por qué elegir Trifasicko Conecta?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Calculator className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Ahorro garantizado</CardTitle>
              <CardDescription>
                Encuentra las tarifas más económicas y ahorra en tus facturas mensuales
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Proceso rápido y sencillo</CardTitle>
              <CardDescription>
                Compara tarifas en minutos y contrata sin complicaciones
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>100% transparente</CardTitle>
              <CardDescription>
                Sin letra pequeña ni costes ocultos. Solo las mejores ofertas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Nuestros servicios</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Comparador de luz
                <Badge variant="secondary">Gratis</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2">
                <li>Compara tarifas de las principales comercializadoras</li>
                <li>Análisis personalizado según tu consumo</li>
                <li>Recomendaciones para reducir tu factura</li>
                <li>Gestión gratuita del cambio de compañía</li>
              </ul>
              <Link href="/comparador-luz" className="mt-4 block">
                <Button className="w-full">Comparar tarifas de luz</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-6 w-6 text-primary" />
                Comparador de internet
                <Badge variant="secondary">Gratis</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2">
                <li>Ofertas de fibra, ADSL y tarifas móviles</li>
                <li>Comprobación de cobertura en tu zona</li>
                <li>Comparativa de velocidades y precios</li>
                <li>Gestión completa de la portabilidad</li>
              </ul>
              <Link href="/comparador-internet" className="mt-4 block">
                <Button className="w-full">Comparar tarifas de internet</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-primary/5 p-8 text-center">
        <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h2 className="mb-4 text-3xl font-bold">
          ¿Listo para empezar a ahorrar?
        </h2>
        <p className="mb-6 text-lg text-muted-foreground">
          Únete a los miles de usuarios que ya han encontrado las mejores tarifas con Trifasicko
          Conecta
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/calculadora-ahorro">
            <Button size="lg">
              <Calculator className="mr-2 h-5 w-5" />
              Calcular mi ahorro
            </Button>
          </Link>
          <Link href="/contacto">
            <Button size="lg" variant="outline">
              ¿Necesitas ayuda?
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
