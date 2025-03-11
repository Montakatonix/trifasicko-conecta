import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trifasicko Conecta - Comparador de tarifas de luz e internet',
  description:
    'Compara y encuentra las mejores tarifas de luz e internet. Ahorra en tus facturas mensuales con Trifasicko Conecta.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Trifasicko Conecta</span>
            </Link>

            <nav className="hidden gap-6 md:flex">
              <Link
                href="/comparador-luz"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Comparador de luz
              </Link>
              <Link
                href="/comparador-internet"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Comparador de internet
              </Link>
              <Link
                href="/calculadora-ahorro"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Calculadora de ahorro
              </Link>
              <Link
                href="/preguntas-frecuentes"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Preguntas frecuentes
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/contacto">
                <Button variant="outline">Contacto</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <Link href="/" className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">Trifasicko Conecta</span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">
                  Tu comparador de confianza para encontrar las mejores tarifas de luz e internet
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold">Servicios</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/comparador-luz" className="hover:text-primary">
                      Comparador de luz
                    </Link>
                  </li>
                  <li>
                    <Link href="/comparador-internet" className="hover:text-primary">
                      Comparador de internet
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculadora-ahorro" className="hover:text-primary">
                      Calculadora de ahorro
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold">Empresa</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/sobre-nosotros" className="hover:text-primary">
                      Sobre nosotros
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="hover:text-primary">
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link href="/preguntas-frecuentes" className="hover:text-primary">
                      Preguntas frecuentes
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/aviso-legal" className="hover:text-primary">
                      Aviso legal
                    </Link>
                  </li>
                  <li>
                    <Link href="/politica-privacidad" className="hover:text-primary">
                      Política de privacidad
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-primary">
                      Política de cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Trifasicko Conecta. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
