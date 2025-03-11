import Link from 'next/link'

import { Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className='bg-muted py-12 border-t'>
      <div className='container px-4 md:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <h3 className='text-lg font-bold'>Trifasicko Conecta</h3>
            <p className='text-sm text-muted-foreground'>
              Tu comparador de tarifas de luz e Internet. Encuentra las mejores ofertas y ahorra en
              tus facturas.
            </p>
            <div className='flex space-x-4'>
              <Link href='#' className='text-muted-foreground hover:text-foreground'>
                <Facebook className='h-5 w-5' />
                <span className='sr-only'>Facebook</span>
              </Link>
              <Link href='#' className='text-muted-foreground hover:text-foreground'>
                <Twitter className='h-5 w-5' />
                <span className='sr-only'>Twitter</span>
              </Link>
              <Link href='#' className='text-muted-foreground hover:text-foreground'>
                <Instagram className='h-5 w-5' />
                <span className='sr-only'>Instagram</span>
              </Link>
            </div>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-bold'>Servicios</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/comparador-luz'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Comparador de Luz
                </Link>
              </li>
              <li>
                <Link
                  href='/comparador-internet'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Comparador de Internet
                </Link>
              </li>
              <li>
                <Link
                  href='/asesoria-energetica'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Asesoría Energética
                </Link>
              </li>
              <li>
                <Link
                  href='/optimizacion-facturas'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Optimización de Facturas
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-bold'>Empresa</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/sobre-nosotros'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href='/blog' className='text-muted-foreground hover:text-foreground'>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/preguntas-frecuentes'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href='/contacto' className='text-muted-foreground hover:text-foreground'>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <h3 className='text-lg font-bold'>Contacto</h3>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-center gap-2 text-muted-foreground'>
                <Mail className='h-4 w-4' />
                <span>info@trifasickoconecta.com</span>
              </li>
              <li className='flex items-center gap-2 text-muted-foreground'>
                <Phone className='h-4 w-4' />
                <span>+34 900 123 456</span>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-12 border-t pt-8 text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} Trifasicko Conecta. Todos los derechos reservados.</p>
          <div className='mt-2 flex justify-center space-x-4'>
            <Link href='/privacidad' className='hover:text-foreground'>
              Política de Privacidad
            </Link>
            <Link href='/terminos' className='hover:text-foreground'>
              Términos y Condiciones
            </Link>
            <Link href='/cookies' className='hover:text-foreground'>
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
