import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BoltIcon, WifiIcon, BarChartIcon, ShieldCheckIcon } from "lucide-react"
import { TestimonialCard } from "@/components/testimonial-card"
import { HighlightedNewsSection } from "@/components/highlighted-news"
import { Image as UImage } from "@/components/ui/image"

const testimonials = [
  {
    name: "María García",
    role: "Cliente residencial",
    content:
      "Gracias a Trifasicko Conecta, logré ahorrar un 20% en mi factura de luz. El proceso fue muy sencillo y la atención al cliente excelente.",
    rating: 5,
    avatarSrc: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Carlos Rodríguez",
    role: "Propietario de PYME",
    content:
      "Comparar tarifas de Internet para mi negocio nunca había sido tan fácil. Encontré una oferta que se ajusta perfectamente a nuestras necesidades.",
    rating: 4,
    avatarSrc: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Laura Martínez",
    role: "Estudiante",
    content:
      "Como estudiante, necesitaba una tarifa de Internet económica pero rápida. Trifasicko Conecta me ayudó a encontrar la mejor opción para mi presupuesto.",
    rating: 5,
    avatarSrc: "/placeholder.svg?height=40&width=40",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 hero-gradient">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Ahorra en tus facturas de luz e Internet
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Compara y encuentra las mejores tarifas adaptadas a tu consumo. Trifasicko Conecta te ayuda a pagar
                  menos cada mes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/comparador-luz">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Comparar Luz</Button>
                </Link>
                <Link href="/comparador-internet">
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary-foreground hover:bg-secondary/10"
                  >
                    Comparar Internet
                  </Button>
                </Link>
              </div>
            </div>
            <UImage
              src="/images/hero-image.jpg"
              width={600}
              height={400}
              alt="Ahorro en facturas de energía y telecomunicaciones"
              className="mx-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nuestros Servicios</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre cómo Trifasicko Conecta puede ayudarte a optimizar tus gastos en servicios esenciales
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <BoltIcon className="h-12 w-12 text-primary" />
                <CardTitle className="text-xl">Electricidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Compara tarifas de luz y encuentra la mejor opción según tu consumo
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <WifiIcon className="h-12 w-12 text-primary" />
                <CardTitle className="text-xl">Internet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Descubre las mejores ofertas de fibra y ADSL disponibles en tu zona
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <BarChartIcon className="h-12 w-12 text-primary" />
                <CardTitle className="text-xl">Análisis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Análisis detallado de tu consumo para optimizar tus facturas</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <ShieldCheckIcon className="h-12 w-12 text-primary" />
                <CardTitle className="text-xl">Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Tus datos siempre protegidos con nuestro sistema de seguridad</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12">
            <UImage
              src="/images/features-collage.jpg"
              width={1200}
              height={400}
              alt="Características de Trifasicko Conecta"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <HighlightedNewsSection />
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Cómo Funciona?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                En tres sencillos pasos podrás empezar a ahorrar en tus facturas
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  1
                </div>
                <CardTitle>Introduce tus datos</CardTitle>
                <CardDescription>Completa un sencillo formulario con tu consumo actual</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  2
                </div>
                <CardTitle>Compara ofertas</CardTitle>
                <CardDescription>Nuestro sistema encuentra las mejores tarifas para ti</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  3
                </div>
                <CardTitle>Ahorra</CardTitle>
                <CardDescription>Selecciona la mejor oferta y empieza a ahorrar</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <UImage
              src="/images/step1-input.jpg"
              width={400}
              height={300}
              alt="Introduce tus datos"
              className="rounded-xl shadow-md"
            />
            <UImage
              src="/images/step2-compare.jpg"
              width={400}
              height={300}
              alt="Compara ofertas"
              className="rounded-xl shadow-md"
            />
            <UImage
              src="/images/step3-save.jpg"
              width={400}
              height={300}
              alt="Ahorra en tus facturas"
              className="rounded-xl shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Lo que dicen nuestros clientes</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre cómo Trifasicko Conecta ha ayudado a miles de personas y empresas a ahorrar en sus facturas de
                luz e Internet.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t relative overflow-hidden">
        <UImage
          src="/images/cta-background.jpg"
          fill
          alt="Fondo de llamada a la acción"
          className="object-cover opacity-20"
        />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Listo para ahorrar?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Regístrate ahora y comienza a comparar tarifas para encontrar la mejor opción
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/registro">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Crear Cuenta</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-secondary text-secondary-foreground hover:bg-secondary/10">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

