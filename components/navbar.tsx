'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Home, Zap, Wifi, Calculator, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  {
    name: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    name: 'Propiedades',
    href: '/propiedades',
    icon: Home,
  },
  {
    name: 'Comparador Luz',
    href: '/comparador-luz',
    icon: Zap,
  },
  {
    name: 'Comparador Internet',
    href: '/comparador-internet',
    icon: Wifi,
  },
  {
    name: 'Calculadora Ahorro',
    href: '/calculadora-ahorro',
    icon: Calculator,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Trifasicko</span>
            <span className="text-primary font-medium">Conecta</span>
          </Link>

          <div className="hidden md:flex md:gap-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild className="hidden md:inline-flex">
            <Link href="/contacto">Contactar</Link>
          </Button>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <Button asChild className="mt-4">
              <Link href="/contacto" onClick={() => setIsMenuOpen(false)}>
                Contactar
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
} 