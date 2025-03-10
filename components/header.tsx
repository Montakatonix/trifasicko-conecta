"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Menu, X, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { app } from "@/lib/firebase"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Trifasicko Conecta</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Inicio
          </Link>
          <Link
            href="/comparador-luz"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/comparador-luz") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Comparador Luz
          </Link>
          <Link
            href="/comparador-internet"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/comparador-internet") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Comparador Internet
          </Link>
          <Link
            href="/blog"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/blog") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Blog
          </Link>
          <Link
            href="/preguntas-frecuentes"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/preguntas-frecuentes") ? "text-foreground" : "text-muted-foreground"}`}
          >
            FAQ
          </Link>
          <Link
            href="/contacto"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/contacto") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Contacto
          </Link>
          <Link
            href="/sobre-nosotros"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/sobre-nosotros") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Sobre Nosotros
          </Link>
          <Link
            href="/resenas"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/resenas") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Reseñas
          </Link>
          <Link
            href="/nuestros-socios"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/nuestros-socios") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Socios
          </Link>
          <Link
            href="/impacto"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/impacto") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Impacto
          </Link>
          <Link
            href="/prensa"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/prensa") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Prensa
          </Link>
          <Link
            href="/calculadora-ahorro"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/calculadora-ahorro") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Calculadora
          </Link>
          <Link
            href="/comunidad"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/comunidad") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Comunidad
          </Link>
          <Link
            href="/api-docs"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/api-docs") ? "text-foreground" : "text-muted-foreground"}`}
          >
            API
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        {app && (
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/perfil" className="w-full">
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/mis-comparaciones" className="w-full">
                      Mis Comparaciones
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/registro">
                  <Button>Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="flex items-center md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <nav className="container grid gap-6 p-6">
            <Link
              href="/"
              className={`text-lg font-medium ${isActive("/") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Inicio
            </Link>
            <Link
              href="/comparador-luz"
              className={`text-lg font-medium ${isActive("/comparador-luz") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Comparador Luz
            </Link>
            <Link
              href="/comparador-internet"
              className={`text-lg font-medium ${isActive("/comparador-internet") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Comparador Internet
            </Link>
            <Link
              href="/blog"
              className={`text-lg font-medium ${isActive("/blog") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Blog
            </Link>
            <Link
              href="/preguntas-frecuentes"
              className={`text-lg font-medium ${isActive("/preguntas-frecuentes") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <Link
              href="/contacto"
              className={`text-lg font-medium ${isActive("/contacto") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Contacto
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`text-lg font-medium ${isActive("/sobre-nosotros") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/resenas"
              className={`text-lg font-medium ${isActive("/resenas") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Reseñas
            </Link>
            <Link
              href="/nuestros-socios"
              className={`text-lg font-medium ${isActive("/nuestros-socios") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Socios
            </Link>
            <Link
              href="/impacto"
              className={`text-lg font-medium ${isActive("/impacto") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Impacto
            </Link>
            <Link
              href="/prensa"
              className={`text-lg font-medium ${isActive("/prensa") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Prensa
            </Link>
            <Link
              href="/calculadora-ahorro"
              className={`text-lg font-medium ${isActive("/calculadora-ahorro") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Calculadora
            </Link>
            <Link
              href="/comunidad"
              className={`text-lg font-medium ${isActive("/comunidad") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Comunidad
            </Link>
            <Link
              href="/api-docs"
              className={`text-lg font-medium ${isActive("/api-docs") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              API
            </Link>
            <div className="border-t pt-4">
              {user ? (
                <>
                  <Link href="/perfil" className="block py-2 text-lg font-medium" onClick={closeMenu}>
                    Mi Perfil
                  </Link>
                  <Link href="/mis-comparaciones" className="block py-2 text-lg font-medium" onClick={closeMenu}>
                    Mis Comparaciones
                  </Link>
                  <button
                    className="flex items-center py-2 text-lg font-medium text-destructive"
                    onClick={() => {
                      signOut()
                      closeMenu()
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/registro" onClick={closeMenu}>
                    <Button className="w-full">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

