import Link from 'next/link'

import { Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react'

const footerLinks = {
  comparadores: [
    { label: 'Comparador de Luz', href: '/comparador-luz' },
    { label: 'Comparador de Internet', href: '/comparador-internet' },
    { label: 'Calculadora de Ahorro', href: '/calculadora-ahorro' },
  ],
  recursos: [
    { label: 'Blog', href: '/blog' },
    { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
    { label: 'Comunidad', href: '/comunidad' },
  ],
  empresa: [
    { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { label: 'Nuestros Socios', href: '/nuestros-socios' },
    { label: 'Impacto Social', href: '/impacto' },
    { label: 'Sala de Prensa', href: '/prensa' },
  ],
  legal: [
    { label: 'Aviso Legal', href: '/legal/aviso-legal' },
    { label: 'Política de Privacidad', href: '/legal/privacidad' },
    { label: 'Términos y Condiciones', href: '/legal/terminos' },
    { label: 'Política de Cookies', href: '/legal/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">Comparadores</h3>
            <ul className="space-y-2">
              {footerLinks.comparadores.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">Trifasicko</span>
              <span className="text-primary">Conecta</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Trifasicko Conecta. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
