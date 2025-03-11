import type { Metadata } from 'next'

import { UserReview } from '@/components/user-review'

export const metadata: Metadata = {
  title: 'Reseñas de Usuarios | Trifasicko Conecta',
  description:
    'Lee las experiencias de nuestros usuarios con el servicio de comparación de tarifas de Trifasicko Conecta.',
}

const reviews = [
  {
    name: 'Juan Pérez',
    rating: 5,
    date: '15/05/2023',
    comment:
      'Gracias a Trifasicko Conecta pude ahorrar un 25% en mi factura de luz. El proceso fue muy sencillo y rápido.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    verifiedPurchase: true,
    service: 'luz' as const,
  },
  {
    name: 'María López',
    rating: 4,
    date: '22/06/2023',
    comment:
      'Encontré una tarifa de Internet mucho mejor que la que tenía. El comparador es muy fácil de usar.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    verifiedPurchase: true,
    service: 'internet' as const,
  },
  {
    name: 'Carlos Rodríguez',
    rating: 5,
    date: '10/07/2023',
    comment:
      'Excelente servicio. Me ayudaron a entender mi factura y a elegir la mejor tarifa para mi negocio.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    verifiedPurchase: true,
    service: 'luz' as const,
  },
  {
    name: 'Ana Martínez',
    rating: 4,
    date: '05/08/2023',
    comment: 'Muy útil para comparar diferentes opciones de Internet. Ahorré tiempo y dinero.',
    avatarSrc: '/placeholder.svg?height=40&width=40',
    verifiedPurchase: false,
    service: 'internet' as const,
  },
  // Añade más reseñas aquí...
]

export default function ResenasPage() {
  return (
    <div className='container py-12'>
      <h1 className='text-3xl font-bold mb-6'>Reseñas de Usuarios</h1>
      <p className='text-muted-foreground mb-8'>
        Descubre lo que nuestros usuarios dicen sobre su experiencia con Trifasicko Conecta.
      </p>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {reviews.map((review, index) => (
          <UserReview key={index} {...review} />
        ))}
      </div>
    </div>
  )
}
